"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { cloneKenneyScene } from "./kenneyMaterials";
import { MODEL_PATHS } from "./KenneyModel";

const BRICK_COLLIDER = {
  halfX: 0.48,
  halfY: 0.48,
  halfZ: 0.48,
  centerY: 0.48,
} as const;

interface BrickBlockProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export function BrickBlock({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: BrickBlockProps) {
  const { scene } = useGLTF(MODEL_PATHS.brick);
  const clone = useMemo(() => {
    const cloned = cloneKenneyScene(scene);
    cloned.traverse((child) => {
      child.userData.cameraFade = true;
    });
    return cloned;
  }, [scene]);
  const s = scale;
  const col = BRICK_COLLIDER;

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false} friction={0.35}>
        <primitive object={clone} scale={s} />
        <CuboidCollider
          args={[col.halfX * s, col.halfY * s, col.halfZ * s]}
          position={[0, col.centerY * s, 0]}
          friction={0.35}
        />
      </RigidBody>
    </group>
  );
}
