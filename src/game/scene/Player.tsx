"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import {
  RigidBody,
  CapsuleCollider,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { findCloudAt } from "../clouds";
import { ASSETS, PLAYER, WORLD } from "../constants";
import { getBuildingCheckpoint } from "../checkpoint";
import { cameraState } from "../cameraControls";
import { inputState } from "../input";
import { playJumpSound, playLandSound } from "../sounds";
import type { CloudBubbleState, GameState, JumpFeedbackLabel } from "../types";
import {
  checkpointFromPlatform,
  computeGameState,
  findChallengeSoftRespawn,
  findCoinAt,
  findFlagAt,
  findMovingPlatformAt,
  findPlatformAt,
} from "./gameLogic";
import { cloneKenneyScene } from "./kenneyMaterials";

const MAX_JUMPS = PLAYER.maxJumps;
const GROUND_RAY = 0.85;
const WALL_RAY = 0.52;
const WALL_NORMAL_Y_MAX = 0.45;
const WALL_JUMP_PUSH = 2;
const BASE_SCALE = 0.9;
const WALL_DIRS: Array<[number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const wallNormalScratch = new THREE.Vector3();

interface PlayerProps {
  onStateChange: (state: GameState) => void;
  paused: boolean;
  coinsCollected: string[];
  flagsDiscovered: string[];
  onCollectCoin: (id: string) => void;
  onDiscoverFlag: (id: string) => void;
}

export const Player = forwardRef<RapierRigidBody, PlayerProps>(function Player(
  {
    onStateChange,
    paused,
    coinsCollected,
    flagsDiscovered,
    onCollectCoin,
    onDiscoverFlag,
  },
  ref,
) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<THREE.Group>(null);
  const jumpsRemaining = useRef<number>(MAX_JUMPS);
  const jumpPressed = useRef(false);
  const wasOnGround = useRef(true);
  const squash = useRef(1);
  const checkpoint = useRef<[number, number, number]>([...WORLD.spawn]);
  const feedbackRef = useRef<JumpFeedbackLabel>(null);
  const feedbackTick = useRef(0);
  const coinsRef = useRef(coinsCollected);
  const flagsRef = useRef(flagsDiscovered);
  const respawnCooldown = useRef(0);
  const wallJumpUsed = useRef(false);
  const cloudBubbleRef = useRef<CloudBubbleState | null>(null);
  const cloudCooldown = useRef(0);
  const insideCloudRef = useRef(false);
  const { world, rapier } = useRapier();

  coinsRef.current = coinsCollected;
  flagsRef.current = flagsDiscovered;

  useImperativeHandle(ref, () => bodyRef.current!);

  const { scene, animations } = useGLTF(ASSETS.character);
  const clone = useMemo(() => cloneKenneyScene(scene), [scene]);
  const { actions } = useAnimations(animations, modelRef);

  function emitFeedback(label: JumpFeedbackLabel) {
    feedbackRef.current = label;
    feedbackTick.current += 1;
  }

  useEffect(() => {
    actions.idle?.reset().fadeIn(0.2).play();
  }, [actions]);

  function isGrounded(body: RapierRigidBody): boolean {
    const pos = body.translation();
    const vel = body.linvel();
    const ray = new rapier.Ray(
      { x: pos.x, y: pos.y - 0.15, z: pos.z },
      { x: 0, y: -1, z: 0 },
    );
    const hit = world.castRay(
      ray,
      GROUND_RAY,
      true,
      undefined,
      undefined,
      undefined,
      body,
    );
    return hit !== null && vel.y <= 0.35;
  }

  function getWallNormal(body: RapierRigidBody): THREE.Vector3 | null {
    const pos = body.translation();
    let closest: THREE.Vector3 | null = null;
    let closestDist = Infinity;

    for (const [dx, dy, dz] of WALL_DIRS) {
      const ray = new rapier.Ray(
        { x: pos.x, y: pos.y + 0.35, z: pos.z },
        { x: dx, y: dy, z: dz },
      );
      const hit = world.castRayAndGetNormal(
        ray,
        WALL_RAY,
        true,
        undefined,
        undefined,
        undefined,
        body,
      );
      if (!hit || Math.abs(hit.normal.y) > WALL_NORMAL_Y_MAX) continue;
      if (hit.timeOfImpact < closestDist) {
        closestDist = hit.timeOfImpact;
        closest = wallNormalScratch.set(
          hit.normal.x,
          hit.normal.y,
          hit.normal.z,
        );
      }
    }

    return closest ? closest.clone() : null;
  }

  function stripIntoWall(
    vx: number,
    vz: number,
    normal: THREE.Vector3,
  ): [number, number] {
    const into = vx * normal.x + vz * normal.z;
    if (into >= 0) return [vx, vz];
    return [vx - into * normal.x, vz - into * normal.z];
  }

  function resolveRespawnPoint(
    fallback: [number, number, number],
  ): [number, number, number] {
    return getBuildingCheckpoint() ?? fallback;
  }

  function softRespawnAtChallenge(
    body: RapierRigidBody,
    zoneRespawn: [number, number, number],
  ) {
    const [x, y, z] = resolveRespawnPoint(zoneRespawn);
    body.setTranslation({ x, y, z }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    jumpsRemaining.current = MAX_JUMPS;
    wallJumpUsed.current = false;
    respawnCooldown.current = 1;
    emitFeedback("Oops!");
  }

  function respawnAtCheckpoint(body: RapierRigidBody) {
    const [x, y, z] = resolveRespawnPoint(checkpoint.current);
    body.setTranslation({ x, y, z }, true);
    body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    jumpsRemaining.current = MAX_JUMPS;
    emitFeedback("Oops!");
  }

  useFrame(({ clock }, delta) => {
    const body = bodyRef.current;
    if (!body) return;

    const pos = body.translation();
    const vel = body.linvel();
    const onGround = isGrounded(body);
    const wallNormal = onGround ? null : getWallNormal(body);
    const elapsed = clock.elapsedTime;

    if (onGround && !wasOnGround.current) {
      playLandSound();
      const platform = findPlatformAt(pos.x, pos.y, pos.z, elapsed);
      if (platform) {
        checkpoint.current = checkpointFromPlatform(platform);
      }
      if (findMovingPlatformAt(pos.x, pos.y, pos.z, elapsed)) {
        emitFeedback("Amazing!");
      }
    }

    if (onGround) {
      jumpsRemaining.current = MAX_JUMPS;
      wallJumpUsed.current = false;
    } else if (
      wallNormal &&
      jumpsRemaining.current === 0 &&
      !wallJumpUsed.current
    ) {
      jumpsRemaining.current = 1;
      wallJumpUsed.current = true;
    }

    wasOnGround.current = onGround;

    if (!paused) {
      const coin = findCoinAt(
        pos.x,
        pos.y,
        pos.z,
        new Set(coinsRef.current),
      );
      if (coin) onCollectCoin(coin.id);

      const flag = findFlagAt(
        pos.x,
        pos.y,
        pos.z,
        new Set(flagsRef.current),
      );
      if (flag) onDiscoverFlag(flag.id);

      if (cloudCooldown.current > 0) {
        cloudCooldown.current -= delta;
      }

      const cloud = findCloudAt(pos.x, pos.y, pos.z);
      if (cloud && !insideCloudRef.current && cloudCooldown.current <= 0) {
        cloudBubbleRef.current = {
          position: cloud.position,
          scale: cloud.scale,
          tick: Date.now(),
        };
        cloudCooldown.current = 2.8;
      }
      insideCloudRef.current = !!cloud;
    }

    if (paused) {
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    } else {
      const input = new THREE.Vector3(
        Number(inputState.right) - Number(inputState.left),
        0,
        Number(inputState.backward) - Number(inputState.forward),
      );

      if (input.lengthSq() > 0) {
        input.normalize();
        input.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraState.yaw);
      }

      let targetVel = input.multiplyScalar(PLAYER.speed);
      if (wallNormal) {
        const [tx, tz] = stripIntoWall(targetVel.x, targetVel.z, wallNormal);
        targetVel = new THREE.Vector3(tx, 0, tz);
      }

      let nextVelX = THREE.MathUtils.lerp(vel.x, targetVel.x, delta * 10);
      let nextVelZ = THREE.MathUtils.lerp(vel.z, targetVel.z, delta * 10);
      if (wallNormal) {
        [nextVelX, nextVelZ] = stripIntoWall(nextVelX, nextVelZ, wallNormal);
      }

      body.setLinvel({ x: nextVelX, y: vel.y, z: nextVelZ }, true);

      if (
        inputState.jump &&
        !jumpPressed.current &&
        jumpsRemaining.current > 0
      ) {
        const remaining = jumpsRemaining.current;
        const strength =
          remaining === MAX_JUMPS
            ? PLAYER.jumpStrength
            : PLAYER.jumpStrength * 0.78;

        let jumpX = vel.x;
        let jumpZ = vel.z;
        if (wallNormal && !onGround) {
          jumpX += wallNormal.x * WALL_JUMP_PUSH;
          jumpZ += wallNormal.z * WALL_JUMP_PUSH;
        }

        body.setLinvel({ x: jumpX, y: strength, z: jumpZ }, true);
        jumpsRemaining.current -= 1;
        squash.current = 0.55;
        playJumpSound();
        emitFeedback(
          remaining === MAX_JUMPS ? "Perfect!" : "Great!",
        );
        actions.jump?.reset().fadeIn(0.1).play();
      }
    }

    jumpPressed.current = inputState.jump;

    squash.current = THREE.MathUtils.lerp(squash.current, 1, delta * 12);
    if (modelRef.current) {
      const s = BASE_SCALE;
      modelRef.current.scale.set(s, s * squash.current, s);

      const horizontal = new THREE.Vector2(vel.x, vel.z);
      if (horizontal.length() > 0.5) {
        modelRef.current.rotation.y = Math.atan2(vel.x, vel.z);
        if (onGround) {
          actions.walk?.play();
          actions.idle?.stop();
        }
      } else if (onGround) {
        actions.idle?.play();
        actions.walk?.stop();
      } else {
        actions.jump?.play();
        actions.walk?.stop();
        actions.idle?.stop();
      }
    }

    if (respawnCooldown.current > 0) {
      respawnCooldown.current -= delta;
    }

    if (!paused) {
      const challenge = findChallengeSoftRespawn(pos.x, pos.y, pos.z);
      if (challenge && respawnCooldown.current <= 0 && vel.y < 1) {
        softRespawnAtChallenge(body, challenge.respawn);
      } else if (pos.y < WORLD.fallY) {
        respawnAtCheckpoint(body);
      }
    }

    onStateChange(
      computeGameState(
        pos.x,
        pos.y,
        pos.z,
        true,
        coinsRef.current,
        flagsRef.current,
        feedbackRef.current,
        feedbackTick.current,
        null,
        onGround,
        elapsed,
        cloudBubbleRef.current,
      ),
    );
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1}
      enabledRotations={[false, false, false]}
      linearDamping={0.3}
      position={WORLD.spawn}
    >
      <CapsuleCollider
        args={[0.28, 0.32]}
        position={[0, 0.5, 0]}
        friction={0.15}
        restitution={0}
      />
      <group
        ref={modelRef}
        position={[0, 0, 0]}
        scale={BASE_SCALE}
        userData={{ skipCameraRay: true }}
      >
        <primitive object={clone} />
      </group>
    </RigidBody>
  );
});
