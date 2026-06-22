"use client";

import type { JumpFeedbackLabel, ZoneId } from "@/game/types";
import { BgmToggle } from "@/components/BgmToggle";

const ZONE_TITLES: Record<ZoneId, string> = {
  home: "Home / Village",
  storyHouse: "Story House",
  museum: "Project Museum",
  tower: "Skill Tower",
  secret: "Secret Area",
};

const ZONE_SUBTITLES: Record<ZoneId, string> = {
  home: "깊은 숲속의 시작",
  storyHouse: "김영섭의 이야기",
  museum: "일한 것들",
  tower: "쓰는 기술",
  secret: "숨겨둔 메모",
};

interface JumpFeedbackProps {
  label: JumpFeedbackLabel;
  tick: number;
}

const FEEDBACK_STYLE: Record<
  NonNullable<JumpFeedbackLabel>,
  string
> = {
  "Perfect!": "text-amber-300 drop-shadow-[0_0_24px_rgba(251,191,36,0.8)]",
  "Great!": "text-sky-300 drop-shadow-[0_0_24px_rgba(125,211,252,0.8)]",
  "Amazing!": "text-violet-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.85)]",
  "Oops!": "text-rose-300 drop-shadow-[0_0_24px_rgba(251,113,133,0.8)]",
};

export function JumpFeedback({ label, tick }: JumpFeedbackProps) {
  if (!label) return null;

  return (
    <div
      key={tick}
      className="pointer-events-none fixed left-1/2 top-[38%] z-50 -translate-x-1/2 animate-[jumpPop_0.65s_ease-out_forwards]"
    >
      <p
        className={`text-5xl font-black tracking-tight ${FEEDBACK_STYLE[label]}`}
      >
        {label}
      </p>
    </div>
  );
}

interface CoinBurstProps {
  tick: number;
}

export function CoinBurst({ tick }: CoinBurstProps) {
  if (!tick) return null;

  return (
    <div
      key={tick}
      className="pointer-events-none fixed left-1/2 top-[42%] z-50 -translate-x-1/2 animate-[coinPop_0.5s_ease-out_forwards]"
    >
      <p className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.9)]">
        +1 코인
      </p>
    </div>
  );
}

interface GameHUDProps {
  zone: ZoneId;
  hint: string;
  isBehindWaterfall: boolean;
  coinsCollected: number;
  totalCoins: number;
  flagsDiscovered: number;
  totalFlags: number;
  /** 0~100 탐험 진행률 */
  explorationPercent: number;
  /** 현재 활성 퀘스트 문구 (없으면 빈 문자열) */
  activeQuest: string;
  /** 건물 입장 가능 시 표시 */
  enterPrompt: { title: string } | null;
  bgmOn: boolean;
  onBgmToggle: () => void;
}

export function GameHUD({
  zone,
  hint,
  isBehindWaterfall,
  coinsCollected,
  totalCoins,
  flagsDiscovered,
  totalFlags,
  explorationPercent,
  activeQuest,
  enterPrompt,
  bgmOn,
  onBgmToggle,
}: GameHUDProps) {
  const isTimingChallenge =
    hint.includes("발판") || hint.includes("타이밍") || hint.includes("건너");

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

      {enterPrompt && (
        <div className="pointer-events-none fixed left-1/2 top-[34%] z-50 -translate-x-1/2 animate-[questPopIn_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300/35 bg-black/65 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <kbd className="hidden rounded-lg bg-white/15 px-2.5 py-1.5 text-sm font-bold text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] sm:inline-block">
              E
            </kbd>
            <span className="text-sm font-semibold text-white">
              {enterPrompt.title} 들어가기
            </span>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed left-0 top-0 z-40 w-full p-4 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="transition-all duration-700">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/30">
              YS World
            </p>
            <h1 className="text-xl font-bold text-white/95 sm:text-2xl">
              {ZONE_TITLES[zone]}
            </h1>
            <p className="mt-0.5 text-xs text-white/40">{ZONE_SUBTITLES[zone]}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="pointer-events-auto">
              <BgmToggle enabled={bgmOn} onToggle={onBgmToggle} size="sm" />
            </div>
            {isBehindWaterfall && (
              <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                <span className="text-xs font-medium text-cyan-200/90">비밀 길</span>
              </div>
            )}
            <div className="flex gap-2">
              <div className="rounded-full border border-yellow-400/25 bg-black/40 px-3 py-1.5 text-xs text-yellow-200/90 backdrop-blur-md">
                🪙 {coinsCollected}/{totalCoins}
              </div>
              <div className="rounded-full border border-green-400/25 bg-black/40 px-3 py-1.5 text-xs text-green-200/90 backdrop-blur-md">
                🚩 {flagsDiscovered}/{totalFlags}
              </div>
              <div className="hidden rounded-full border border-sky-400/30 bg-black/40 px-3 py-1.5 text-xs text-sky-200/90 backdrop-blur-md sm:block">
                🔍 {explorationPercent}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 max-w-[90vw] -translate-x-1/2 sm:bottom-8">
        <div className="space-y-1.5">
          <p
            className={`rounded-full px-4 py-2 text-center text-[11px] tracking-wide backdrop-blur-md sm:px-6 sm:py-2.5 sm:text-xs ${
              isTimingChallenge
                ? "border border-amber-300/35 bg-amber-950/45 text-amber-100/90 shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                : "border border-white/8 bg-black/40 text-white/60"
            }`}
          >
            {isTimingChallenge && (
              <span className="mr-1.5 inline-block animate-pulse">⏱</span>
            )}
            {hint}
          </p>
          {activeQuest && (
            <p
              id="quest-chip"
              className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-sky-400/35 bg-sky-900/40 px-4 py-1.5 text-[10px] font-medium text-sky-100 backdrop-blur-md sm:text-[11px]"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-300 shadow-[0_0_6px_rgba(125,211,252,0.9)]" />
              <span className="text-[11px] font-medium text-sky-200/80">
                목표
              </span>
              <span className="text-[11px] normal-case tracking-normal text-sky-50 sm:text-xs">
                {activeQuest}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
