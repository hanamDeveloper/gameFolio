"use client";

import { ContactShadows, Stars } from "@react-three/drei";
import { Physics, type RapierRigidBody } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import type { CloudBubbleState, GameCallbacks, GameState, ZoneId } from "../types";
import type { IntroPhase } from "../introCamera";
import { ZONE_THEMES } from "../zoneTheme";
import { CloudSpeechBubble } from "./CloudSpeechBubble";
import { CameraRig } from "./CameraRig";
import { Player } from "./Player";
import { World } from "./World";

interface GameSceneProps {
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

function ZoneEnvironment({ zone }: { zone: ZoneId }) {
  const theme = ZONE_THEMES[zone];

  return (
    <>
      <color attach="background" args={[theme.background]} />
      <fog attach="fog" args={[theme.fog, theme.fogNear, theme.fogFar]} />
      <hemisphereLight args={[theme.hemiSky, theme.hemiGround, 1.1]} />
      <ambientLight intensity={theme.ambient} />
      <directionalLight
        castShadow
        intensity={theme.dirIntensity}
        position={[30, 40, 20]}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight intensity={0.6} position={[-20, 15, -10]} />
    </>
  );
}

function SceneContent({
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
}: GameSceneProps) {
  const playerRef = useRef<RapierRigidBody>(null);

  return (
    <>
      <ZoneEnvironment zone={zone} />
      <Stars radius={80} depth={40} count={1200} factor={3} fade speed={0.5} />

      <Physics gravity={[0, -25, 0]}>
        <World
          playerPosition={playerPosition}
          coinsCollected={coinsCollected}
          flagsDiscovered={flagsDiscovered}
          hideLandmarkLabels={hideLandmarkLabels}
        />
        <Player
          ref={playerRef}
          onStateChange={onStateChange}
          paused={paused}
          coinsCollected={coinsCollected}
          flagsDiscovered={flagsDiscovered}
          onCollectCoin={onCollectCoin}
          onDiscoverFlag={onDiscoverFlag}
        />
      </Physics>

      <ContactShadows
        position={[2, -0.4, 0]}
        opacity={0.35}
        scale={110}
        blur={2.5}
        far={30}
      />
      <CameraRig
        target={playerRef}
        fallbackPosition={playerPosition}
        introPhase={introPhase}
        introZoom={introZoom}
      />
      <CloudSpeechBubble bubble={cloudBubble} />
    </>
  );
}

export function GameScene(props: GameSceneProps) {
  return (
    <Suspense fallback={null}>
      <SceneContent {...props} />
    </Suspense>
  );
}
