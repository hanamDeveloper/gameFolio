"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { KenneyModel } from "./KenneyModel";
import { isNearPlayer } from "./worldCull";

function LandmarkLabel({
  label,
  subtitle,
  height,
  accent,
}: {
  label: string;
  subtitle: string;
  height: number;
  accent: string;
}) {
  return (
    <Html
      position={[0, height, 0]}
      center
      distanceFactor={14}
      zIndexRange={[30, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div className="flex flex-col items-center gap-0.5 font-sans">
        <div
          className="whitespace-nowrap rounded-lg px-4 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, ${accent}55, rgba(0,0,0,0.75))`,
            border: `1px solid ${accent}66`,
          }}
        >
          {label}
        </div>
        <span className="text-[10px] font-medium tracking-wide text-white/70">
          {subtitle}
        </span>
      </div>
    </Html>
  );
}

function LandmarkBeacon({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.sin(clock.elapsedTime * 2) * 0.12;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
      <ringGeometry args={[1.8, 2.6, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function StoryHouseLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[-5, 4.8, -7.5]}>
      <LandmarkBeacon color="#fbbf24" />
      <KenneyModel model="grass" position={[-1.8, 0, 1.2]} scale={1.05} />
      <KenneyModel model="grassSmall" position={[1.6, 0, -0.6]} />
      <KenneyModel model="flag" position={[0, 0.2, 0]} />
      <pointLight position={[0, 2, 0]} intensity={8} color="#ffb870" distance={12} />
      {!hideLabels && (
        <LandmarkLabel
          label="Story House"
          subtitle="코드가 아닌 제품을 위해"
          height={5.5}
          accent="#fbbf24"
        />
      )}
    </group>
  );
}

function MuseumLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[16, 10.4, 2]}>
      <LandmarkBeacon color="#fcd34d" />
      <KenneyModel model="grassSmall" position={[-1.4, 0, 1]} />
      <KenneyModel model="grassSmall" position={[1.2, 0, -0.8]} />
      <KenneyModel model="flag" position={[0, 0.2, 0]} />
      <pointLight position={[0, 2, 0]} intensity={8} color="#ffd080" distance={14} />
      {!hideLabels && (
        <LandmarkLabel
          label="Project Museum"
          subtitle="경력 · 사이드 프로젝트"
          height={5}
          accent="#fcd34d"
        />
      )}
    </group>
  );
}

function BridgeHouseLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[-11, 6, -7]}>
      <LandmarkBeacon color="#34d399" />
      <KenneyModel model="brick" position={[-1.2, 0.3, 0.8]} scale={0.9} />
      <KenneyModel model="brick" position={[1.1, 0.3, -0.6]} scale={0.85} />
      <KenneyModel model="grassSmall" position={[0.8, 0, 1]} />
      <KenneyModel model="flag" position={[0, 0.2, 0]} scale={0.9} />
      <pointLight position={[0, 2, 0]} intensity={7} color="#6ee7b7" distance={11} />
      {!hideLabels && (
        <LandmarkLabel
          label="Bridge House"
          subtitle="포지션 · 시작"
          height={5}
          accent="#34d399"
        />
      )}
    </group>
  );
}

function FailureMuseumLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[-9, 7.2, 10]}>
      <LandmarkBeacon color="#f87171" />
      <KenneyModel model="grass" position={[-1.5, 0, -0.8]} scale={0.95} />
      <KenneyModel model="flag" position={[0, 0.2, 0]} scale={0.95} />
      <pointLight position={[0, 1.8, 0]} intensity={6} color="#fca5a5" distance={10} />
      {!hideLabels && (
        <LandmarkLabel
          label="Failure Museum"
          subtitle="실패와 배움"
          height={5}
          accent="#f87171"
        />
      )}
    </group>
  );
}

function TowerLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[1, 12.8, -10.5]}>
      <LandmarkBeacon color="#93c5fd" />
      <KenneyModel model="platform" position={[0, -0.15, 0]} scale={0.55} />
      <KenneyModel model="flag" position={[0, 0.5, 0]} />
      <KenneyModel model="cloud" position={[2.2, 4.5, -1.8]} scale={1.1} fadeOnOcclude />
      <pointLight position={[0, 1.5, 0]} intensity={7} color="#a0c8ff" distance={12} />
      {!hideLabels && (
        <LandmarkLabel
          label="Skill Tower"
          subtitle="쓰는 기술"
          height={4.8}
          accent="#93c5fd"
        />
      )}
    </group>
  );
}

function FutureLabLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[-4, 16, 10.5]}>
      <LandmarkBeacon color="#c4b5fd" />
      <KenneyModel model="grassSmall" position={[-1.2, 0, 1]} />
      <KenneyModel model="grassSmall" position={[1.1, 0, -0.9]} />
      <KenneyModel model="coin" position={[0, 0.8, 0]} scale={0.9} />
      <KenneyModel model="flag" position={[0, 0.2, 0.6]} scale={0.85} />
      <pointLight position={[0, 1.2, 0]} intensity={9} color="#c4b5fd" distance={11} />
      {!hideLabels && (
        <LandmarkLabel
          label="Future Lab"
          subtitle="앞으로"
          height={4.2}
          accent="#c4b5fd"
        />
      )}
    </group>
  );
}

function SecretCaveLandmark({ hideLabels }: { hideLabels?: boolean }) {
  return (
    <group position={[6, 14.8, 0.5]}>
      <LandmarkBeacon color="#67e8f9" />
      <KenneyModel model="grass" position={[-1.6, 0, -0.8]} scale={0.95} />
      <KenneyModel model="cloud" position={[2, 2.2, 1.2]} scale={1.4} fadeOnOcclude />
      <KenneyModel model="cloud" position={[2.8, 3, 1.5]} scale={1.1} fadeOnOcclude />
      <pointLight position={[0, 1.2, 0]} intensity={10} color="#60d0ff" distance={10} />
      {!hideLabels && (
        <LandmarkLabel
          label="Secret Area"
          subtitle="숨겨둔 메모"
          height={4.8}
          accent="#67e8f9"
        />
      )}
    </group>
  );
}

export function Landmarks({
  hideLabels = false,
  playerPosition,
}: {
  hideLabels?: boolean;
  playerPosition: [number, number, number];
}) {
  const show = (pos: [number, number, number]) => isNearPlayer(pos, playerPosition);

  return (
    <group>
      {show([-5, 4.8, -7.5]) && <StoryHouseLandmark hideLabels={hideLabels} />}
      {show([-11, 6, -7]) && <BridgeHouseLandmark hideLabels={hideLabels} />}
      {show([16, 10.4, 2]) && <MuseumLandmark hideLabels={hideLabels} />}
      {show([-9, 7.2, 10]) && <FailureMuseumLandmark hideLabels={hideLabels} />}
      {show([1, 12.8, -10.5]) && <TowerLandmark hideLabels={hideLabels} />}
      {show([-4, 16, 10.5]) && <FutureLabLandmark hideLabels={hideLabels} />}
      {show([6, 14.8, 0.5]) && <SecretCaveLandmark hideLabels={hideLabels} />}
    </group>
  );
}
