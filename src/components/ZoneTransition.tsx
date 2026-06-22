"use client";

import { ZONE_LABELS } from "@/game/zoneTheme";
import type { ZoneId } from "@/game/types";

interface ZoneTransitionProps {
  zone: ZoneId;
  visible: boolean;
}

export function ZoneTransition({ zone, visible }: ZoneTransitionProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[55] flex items-center justify-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative text-center animate-[zoneFade_1.4s_ease-out_forwards]">
        <p className="mb-2 text-[10px] font-medium text-white/40">
          이동 중
        </p>
        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
          {ZONE_LABELS[zone]}
        </h2>
      </div>
    </div>
  );
}
