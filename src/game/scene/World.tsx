"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { COINS, DECORATIONS, FLAGS, MOVING_PLATFORMS, PLATFORMS } from "../constants";
import { isMovingPlatformNearPlayer } from "../movingPlatform";
import type { FlagDef } from "../types";
import { KenneyModel } from "./KenneyModel";
import { BrickBlock } from "./BrickBlock";
import { Landmarks } from "./Landmark";
import { MovingPlatform } from "./MovingPlatform";
import { Platform } from "./Platform";
import { isNearPlayer } from "./worldCull";

function SpinningCoin({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  visible,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  visible: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current && visible) ref.current.rotation.y += delta * 2.5;
  });

  if (!visible) return null;

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <KenneyModel model="coin" scale={scale} />
    </group>
  );
}

function WorldFlag({
  flag,
  discovered,
}: {
  flag: FlagDef;
  discovered: boolean;
}) {
  return (
    <group position={flag.position} rotation={flag.rotation}>
      <KenneyModel model="flag" scale={flag.scale ?? 1} />
      {discovered && (
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
      )}
    </group>
  );
}

interface WorldProps {
  playerPosition: [number, number, number];
  coinsCollected: string[];
  flagsDiscovered: string[];
  hideLandmarkLabels?: boolean;
}

export function World({
  playerPosition,
  coinsCollected,
  flagsDiscovered,
  hideLandmarkLabels,
}: WorldProps) {
  const collectedSet = new Set(coinsCollected);
  const flagSet = new Set(flagsDiscovered);
  const [px, py, pz] = playerPosition;

  const visiblePlatforms = useMemo(
    () => PLATFORMS.filter((plat) => isNearPlayer(plat.position, playerPosition)),
    [px, py, pz],
  );

  const visibleMovers = useMemo(
    () => MOVING_PLATFORMS.filter((m) => isMovingPlatformNearPlayer(m, playerPosition)),
    [px, py, pz],
  );

  const visibleDecor = useMemo(
    () =>
      DECORATIONS.filter(
        (d) =>
          d.model !== "coin" &&
          d.model !== "flag" &&
          isNearPlayer(d.position, playerPosition),
      ),
    [px, py, pz],
  );

  const visibleCoins = useMemo(
    () => COINS.filter((c) => isNearPlayer(c.position, playerPosition)),
    [px, py, pz],
  );

  const visibleFlags = useMemo(
    () => FLAGS.filter((f) => isNearPlayer(f.position, playerPosition)),
    [px, py, pz],
  );

  return (
    <group>
      {visiblePlatforms.map((plat, i) => (
        <Platform
          key={`plat-${plat.position.join(",")}-${i}`}
          model={plat.model}
          position={plat.position}
          rotation={plat.rotation}
          scale={plat.scale}
        />
      ))}

      {visibleMovers.map((mover) => (
        <MovingPlatform key={mover.id} def={mover} />
      ))}

      {visibleDecor.map((dec, i) =>
        dec.model === "brick" ? (
          <BrickBlock
            key={`dec-${dec.position.join(",")}-${i}`}
            position={dec.position}
            rotation={dec.rotation}
            scale={dec.scale}
          />
        ) : dec.model === "cloud" ? (
          <KenneyModel
            key={`dec-${dec.position.join(",")}-${i}`}
            model={dec.model}
            position={dec.position}
            rotation={dec.rotation}
            scale={dec.scale}
            fadeOnOcclude
          />
        ) : (
          <KenneyModel
            key={`dec-${dec.position.join(",")}-${i}`}
            model={dec.model}
            position={dec.position}
            rotation={dec.rotation}
            scale={dec.scale}
          />
        ),
      )}

      {visibleCoins.map((coin) => (
        <SpinningCoin
          key={coin.id}
          position={coin.position}
          rotation={coin.rotation}
          scale={coin.scale}
          visible={!collectedSet.has(coin.id)}
        />
      ))}

      {visibleFlags.map((flag) => (
        <WorldFlag
          key={flag.id}
          flag={flag}
          discovered={flagSet.has(flag.id)}
        />
      ))}

      <Landmarks
        hideLabels={hideLandmarkLabels}
        playerPosition={playerPosition}
      />
    </group>
  );
}
