"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import {
  DEFAULT_CAMERA,
  MIN_CAMERA_DISTANCE,
  cameraState,
  fadeOccludingMesh,
  resetCameraToDefault,
  restoreFadedMaterials,
  shouldFadeOnOcclude,
  shouldSkipCameraRay,
} from "../cameraControls";
import { INTRO_CAMERA, INTRO_ORBIT, type IntroPhase } from "../introCamera";
import { readRigidBodyMotion } from "./rigidBodySafe";

interface CameraRigProps {
  target: React.RefObject<RapierRigidBody | null>;
  fallbackPosition?: [number, number, number];
  introPhase?: IntroPhase;
  introZoom?: number;
}

function orbitOffset(
  yaw: number,
  pitch: number,
  distance: number,
  yBoost: number,
): THREE.Vector3 {
  return new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch) * distance,
    Math.sin(pitch) * distance + yBoost,
    Math.cos(yaw) * Math.cos(pitch) * distance,
  );
}

function orbitPosition(
  look: THREE.Vector3,
  yaw: number,
  pitch: number,
  distance: number,
  yBoost: number,
): THREE.Vector3 {
  return look.clone().add(orbitOffset(yaw, pitch, distance, yBoost));
}

export function CameraRig({
  target,
  fallbackPosition,
  introPhase = "idle",
  introZoom = 0,
}: CameraRigProps) {
  const { scene } = useThree();
  const lookAt = useRef(new THREE.Vector3());
  const smoothY = useRef(3);
  const prevY = useRef(3);
  const smoothDistance = useRef(cameraState.distance);
  const smoothPitch = useRef(cameraState.pitch);
  const raycaster = useRef(new THREE.Raycaster());
  const overviewLook = useRef(new THREE.Vector3(...INTRO_CAMERA.overviewLookAt));
  const blendLook = useRef(new THREE.Vector3());
  const blendPos = useRef(new THREE.Vector3());
  const introEndSynced = useRef(false);

  useFrame(({ camera }, delta) => {
    const body = target.current;
    const bodyMotion = body ? readRigidBodyMotion(body) : null;
    const motion =
      bodyMotion ??
      (fallbackPosition
        ? {
            x: fallbackPosition[0],
            y: fallbackPosition[1],
            z: fallbackPosition[2],
            vy: 0,
          }
        : null);

    if (!motion) return;

    restoreFadedMaterials();

    const { x, y, z, vy } = motion;
    const yDelta = Math.abs(y - prevY.current);
    prevY.current = y;

    const followSpeed = yDelta > 0.8 || Math.abs(vy) > 4 ? 0.05 : 0.1;
    smoothY.current = THREE.MathUtils.lerp(smoothY.current, y, followSpeed);

    lookAt.current.set(x, smoothY.current + 1.2, z);

    smoothPitch.current = THREE.MathUtils.lerp(
      smoothPitch.current,
      cameraState.pitch,
      0.08,
    );

    const pitch = smoothPitch.current;
    const yaw = cameraState.yaw;
    const idealDistance = cameraState.distance;

    const offsetDir = new THREE.Vector3(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.cos(yaw) * Math.cos(pitch),
    ).normalize();

    const inCinematic =
      introPhase === "title" || introPhase === "zoom";

    if (!inCinematic) {
      raycaster.current.set(lookAt.current, offsetDir);
      raycaster.current.far = idealDistance;
      raycaster.current.near = 0.4;

      const hits = raycaster.current.intersectObjects(scene.children, true);
      let allowedDistance = idealDistance;

      for (const hit of hits) {
        if (shouldSkipCameraRay(hit.object)) continue;
        if (hit.distance < allowedDistance) {
          allowedDistance = Math.max(hit.distance - 0.8, MIN_CAMERA_DISTANCE);
        }
        if (shouldFadeOnOcclude(hit.object)) {
          fadeOccludingMesh(hit.object);
        }
      }

      smoothDistance.current = THREE.MathUtils.lerp(
        smoothDistance.current,
        allowedDistance,
        1 - Math.pow(0.001, delta),
      );
    }

    if (introPhase !== "ready" && introPhase !== "zoom") {
      introEndSynced.current = false;
    }

    const pitchUsed = smoothPitch.current;
    const offset = orbitOffset(
      yaw,
      pitchUsed,
      smoothDistance.current,
      DEFAULT_CAMERA.yBoost,
    );

    const desiredPos = lookAt.current.clone().add(offset);
    const persp = camera as THREE.PerspectiveCamera;

    if (introPhase === "title") {
      camera.position.set(...INTRO_CAMERA.overviewPosition);
      camera.lookAt(overviewLook.current);
      persp.fov = INTRO_CAMERA.overviewFov;
      persp.updateProjectionMatrix();
      return;
    }

    if (introPhase === "zoom") {
      const t = introZoom;
      blendLook.current.copy(overviewLook.current).lerp(lookAt.current, t);

      const dist = THREE.MathUtils.lerp(
        INTRO_ORBIT.distance,
        DEFAULT_CAMERA.distance,
        t,
      );
      const zoomPitch = THREE.MathUtils.lerp(
        INTRO_ORBIT.pitch,
        DEFAULT_CAMERA.pitch,
        t,
      );
      const zoomYaw = THREE.MathUtils.lerp(INTRO_ORBIT.yaw, DEFAULT_CAMERA.yaw, t);
      const yBoost = THREE.MathUtils.lerp(
        INTRO_ORBIT.yBoost,
        DEFAULT_CAMERA.yBoost,
        t,
      );

      blendPos.current.copy(
        orbitPosition(blendLook.current, zoomYaw, zoomPitch, dist, yBoost),
      );
      camera.position.copy(blendPos.current);
      camera.lookAt(blendLook.current);
      persp.fov = THREE.MathUtils.lerp(
        INTRO_CAMERA.overviewFov,
        INTRO_CAMERA.gameFov,
        t,
      );
      persp.updateProjectionMatrix();
      return;
    }

    if (introPhase === "ready") {
      if (!introEndSynced.current) {
        resetCameraToDefault();
        introEndSynced.current = true;
      }

      smoothY.current = y;
      lookAt.current.set(x, y + 1.2, z);
      smoothDistance.current = DEFAULT_CAMERA.distance;
      smoothPitch.current = DEFAULT_CAMERA.pitch;

      const snapPos = orbitPosition(
        lookAt.current,
        DEFAULT_CAMERA.yaw,
        DEFAULT_CAMERA.pitch,
        DEFAULT_CAMERA.distance,
        DEFAULT_CAMERA.yBoost,
      );
      camera.position.copy(snapPos);
      camera.lookAt(lookAt.current);
      persp.fov = INTRO_CAMERA.gameFov;
      persp.updateProjectionMatrix();
      return;
    }

    camera.position.lerp(desiredPos, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAt.current);

    if (persp.fov !== INTRO_CAMERA.gameFov) {
      persp.fov = THREE.MathUtils.lerp(persp.fov, INTRO_CAMERA.gameFov, 0.08);
      persp.updateProjectionMatrix();
    }
  });

  return null;
}
