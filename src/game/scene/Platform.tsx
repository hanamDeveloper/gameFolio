"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import type { KenneyModelId } from "../types";
import { cloneKenneyScene } from "./kenneyMaterials";
import { MODEL_PATHS } from "./KenneyModel";

const PLATFORM_MODELS = new Set<KenneyModelId>([
  "platform",
  "platformMedium",
  "platformLarge",
  "platformGrassRound",
]);

/** 시각 메쉬와 분리된 안정적인 상단 충돌 박스 */
const COLLIDER: Record<
  KenneyModelId,
  { halfX: number; halfZ: number; halfY: number; centerY: number }
> = {
  platform: { halfX: 1.75, halfZ: 1.75, halfY: 0.22, centerY: 0.38 },
  platformMedium: { halfX: 2.45, halfZ: 2.45, halfY: 0.22, centerY: 0.38 },
  platformLarge: { halfX: 3.1, halfZ: 3.1, halfY: 0.22, centerY: 0.38 },
  platformGrassRound: { halfX: 2.05, halfZ: 2.05, halfY: 0.22, centerY: 0.38 },
  grass: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
  grassSmall: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
  cloud: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
  brick: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
  coin: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
  flag: { halfX: 0, halfZ: 0, halfY: 0, centerY: 0 },
};

function Platform({
  model,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  model: KenneyModelId;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(MODEL_PATHS[model]);
  const clone = useMemo(() => cloneKenneyScene(scene), [scene]);
  const col = COLLIDER[model];
  const s = scale;

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders={false} friction={0.35}>
        <primitive object={clone} scale={s} />
        <CuboidCollider
          args={[col.halfX * s, col.halfY, col.halfZ * s]}
          position={[0, col.centerY * s, 0]}
          friction={0.35}
        />
      </RigidBody>
    </group>
  );
}

export { Platform, COLLIDER };
