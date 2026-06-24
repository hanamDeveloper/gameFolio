"use client";

import { BUILDING_DESTINATIONS } from "@/game/travel";

const BUILDING_CHIP: Record<string, { letter: string; color: string }> = {
  "story-house": { letter: "S", color: "#fbbf24" },
  "bridge-house": { letter: "B", color: "#34d399" },
  "failure-museum": { letter: "F", color: "#f87171" },
  "project-museum": { letter: "P", color: "#fcd34d" },
  "skill-tower": { letter: "T", color: "#60a5fa" },
  "future-lab": { letter: "L", color: "#a78bfa" },
  "secret-cave": { letter: "?", color: "#22d3ee" },
};

interface QuickTravelBarProps {
  visitedIds: string[];
  onOpenBuilding: (destinationId: string) => void;
}

export function QuickTravelBar({
  visitedIds,
  onOpenBuilding,
}: QuickTravelBarProps) {
  return (
    <div className="pointer-events-auto fixed right-3 top-1/2 z-40 max-h-[min(88vh,560px)] -translate-y-1/2 sm:right-5">
      <div className="flex max-h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-black/45 shadow-[0_8px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <p className="border-b border-white/8 px-3 py-2 text-center text-[10px] font-bold tracking-wide text-white/45">
          바로 보기
        </p>

        <div className="flex flex-col gap-0.5 overflow-y-auto p-2">
          {BUILDING_DESTINATIONS.map((dest) => {
            const chip = BUILDING_CHIP[dest.id] ?? {
              letter: "·",
              color: "#8b95a1",
            };
            const visited = visitedIds.includes(dest.id);

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => onOpenBuilding(dest.id)}
                aria-label={`${dest.title} 바로 보기`}
                className="group flex items-center gap-2.5 rounded-[14px] px-1.5 py-1.5 text-left transition hover:bg-white/6 active:scale-[0.98]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold leading-tight text-white/92 sm:text-[12px]">
                    {dest.title}
                  </p>
                  <p className="truncate text-[9px] leading-tight text-white/45 sm:text-[10px]">
                    {dest.subtitle}
                  </p>
                </div>

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition group-hover:scale-105 sm:h-10 sm:w-10 sm:text-[14px] ${
                    visited
                      ? "ring-2 ring-sky-300/70 ring-offset-1 ring-offset-black/40"
                      : ""
                  }`}
                  style={{
                    background: `color-mix(in srgb, ${chip.color} 88%, white)`,
                  }}
                >
                  {chip.letter}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
