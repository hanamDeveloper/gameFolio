"use client";

import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import { ASSETS } from "../constants";
import { getMovingPlatformPosition } from "../movingPlatform";
import type { MovingPlatformDef } from "../types";
import { cloneKenneyScene } from "./kenneyMaterials";
import { MODEL_PATHS } from "./KenneyModel";
import { COLLIDER } from "./Platform";

export function MovingPlatform({ def }: { def: MovingPlatformDef }) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const glowRef = useRef<Mesh>(null);
  const { scene } = useGLTF(MODEL_PATHS[def.model]);
  const clone = useMemo(() => cloneKenneyScene(scene), [scene]);
  const scale = def.scale ?? 1;
  const col = COLLIDER[def.model];

  useFrame(({ clock }) => {
    const body = bodyRef.current;
    if (!body) return;
    const [x, y, z] = getMovingPlatformPosition(def, clock.elapsedTime);
    body.setNextKinematicTranslation({ x, y, z });

    if (glowRef.current) {
      const pulse = 0.55 + Math.sin(clock.elapsedTime * def.speed * 2) * 0.15;
      glowRef.current.scale.set(pulse, 1, pulse);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      friction={0.35}
      position={def.position}
    >
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[1.4 * scale, 2.1 * scale, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} />
      </mesh>
      <primitive object={clone} scale={scale} />
      <CuboidCollider
        args={[col.halfX * scale, col.halfY, col.halfZ * scale]}
        position={[0, col.centerY * scale, 0]}
        friction={0.35}
      />
    </RigidBody>
  );
}

useGLTF.preload(ASSETS.platformLarge);
