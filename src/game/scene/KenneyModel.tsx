"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { ASSETS } from "../constants";
import type { KenneyModelId } from "../types";
import { cloneKenneyScene } from "./kenneyMaterials";

export const MODEL_PATHS: Record<KenneyModelId, string> = {
  platform: ASSETS.platform,
  platformMedium: ASSETS.platformMedium,
  platformLarge: ASSETS.platformLarge,
  platformGrassRound: ASSETS.platformGrassRound,
  grass: ASSETS.grass,
  grassSmall: ASSETS.grassSmall,
  cloud: ASSETS.cloud,
  brick: ASSETS.brick,
  coin: ASSETS.coin,
  flag: ASSETS.flag,
};

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
useGLTF.preload(ASSETS.character);

interface KenneyModelProps {
  model: KenneyModelId;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** 카메라와 플레이어 사이에 있으면 반투명 처리 */
  fadeOnOcclude?: boolean;
}

export function KenneyModel({
  model,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  fadeOnOcclude = false,
}: KenneyModelProps) {
  const { scene } = useGLTF(MODEL_PATHS[model]);
  const clone = useMemo(() => {
    const cloned = cloneKenneyScene(scene);
    if (fadeOnOcclude) {
      cloned.traverse((child) => {
        child.userData.cameraFade = true;
      });
    }
    return cloned;
  }, [scene, fadeOnOcclude]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
