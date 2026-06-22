"use client";

import { Canvas } from "@react-three/fiber";
import { GameScene } from "@/game/scene/GameScene";
import type { CloudBubbleState, GameCallbacks, GameState, ZoneId } from "@/game/types";
import type { IntroPhase } from "@/game/introCamera";

interface GameCanvasProps {
  zone: ZoneId;
  paused: boolean;
  hideLandmarkLabels?: boolean;
  playerPosition: [number, number, number];
  coinsCollected: string[];
  flagsDiscovered: string[];
  cloudBubble: CloudBubbleState | null;
  introPhase?: IntroPhase;
  introZoom?: number;
  onStateChange: (state: GameState) => void;
  onCollectCoin: GameCallbacks["onCollectCoin"];
  onDiscoverFlag: GameCallbacks["onDiscoverFlag"];
}

export default function GameCanvas({
  zone,
  paused,
  hideLandmarkLabels,
  playerPosition,
  coinsCollected,
  flagsDiscovered,
  cloudBubble,
  introPhase = "idle",
  introZoom = 0,
  onStateChange,
  onCollectCoin,
  onDiscoverFlag,
}: GameCanvasProps) {
  return (
    <Canvas
      shadows="percentage"
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 8, 14] }}
      className="block h-full w-full touch-none"
      aria-label="YS World 3D 탐험"
    >
      <GameScene
        zone={zone}
        paused={paused}
        hideLandmarkLabels={hideLandmarkLabels}
        playerPosition={playerPosition}
        coinsCollected={coinsCollected}
        flagsDiscovered={flagsDiscovered}
        cloudBubble={cloudBubble}
        introPhase={introPhase}
        introZoom={introZoom}
        onStateChange={onStateChange}
        onCollectCoin={onCollectCoin}
        onDiscoverFlag={onDiscoverFlag}
      />
    </Canvas>
  );
}
