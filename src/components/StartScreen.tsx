"use client";

import { BgmToggle } from "@/components/BgmToggle";
import type { IntroPhase } from "@/game/introCamera";

interface StartScreenProps {
  phase: IntroPhase;
  zoomProgress: number;
  bgmOn: boolean;
  onBgmToggle: () => void;
  onStart: () => void;
}

export function StartScreen({
  phase,
  zoomProgress,
  bgmOn,
  onBgmToggle,
  onStart,
}: StartScreenProps) {
  if (phase === "idle") return null;

  const showTitle = phase === "title" || (phase === "zoom" && zoomProgress < 0.12);
  const showTap = phase === "ready";
  const titleExiting = phase === "zoom";

  return (
    <div
      className="fixed inset-0 z-[200] select-none"
      role={showTap ? "button" : "presentation"}
      tabIndex={showTap ? 0 : -1}
      onClick={showTap ? onStart : undefined}
      onKeyDown={
        showTap
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onStart();
              }
            }
          : undefined
      }
      aria-label={showTap ? "탭하여 게임 시작" : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,4,12,0.55)_100%)]" />

      <div
        className="pointer-events-none absolute left-[8%] top-[14%] h-28 w-28 rounded-full opacity-50 blur-3xl"
        style={{ background: "#fbbf24" }}
      />
      <div
        className="pointer-events-none absolute bottom-[18%] right-[6%] h-32 w-32 rounded-full opacity-40 blur-3xl"
        style={{ background: "#818cf8" }}
      />
      <div
        className="pointer-events-none absolute right-[20%] top-[22%] h-20 w-20 rounded-full opacity-35 blur-2xl"
        style={{ background: "#34d399" }}
      />

      <div className="pointer-events-auto absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
        <BgmToggle enabled={bgmOn} onToggle={onBgmToggle} />
      </div>

      {showTitle && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
          <p
            className={`mb-3 text-[11px] font-bold tracking-[0.35em] text-white/70 ${
              titleExiting
                ? "animate-[introTitleOut_0.7s_ease-in_forwards]"
                : "animate-[introTitleIn_1s_cubic-bezier(0.22,1,0.36,1)_both]"
            }`}
            style={{ animationDelay: titleExiting ? "0ms" : "200ms" }}
          >
            김영섭 포트폴리오 월드
          </p>
          <h1
            className={`bg-gradient-to-r from-amber-300 via-sky-300 to-violet-300 bg-clip-text text-center text-[clamp(2.5rem,11vw,4.5rem)] font-black leading-none tracking-tight text-transparent drop-shadow-[0_4px_32px_rgba(255,255,255,0.25)] ${
              titleExiting
                ? "animate-[introTitleOut_0.7s_ease-in_forwards]"
                : "animate-[introTitleIn_1.1s_cubic-bezier(0.22,1,0.36,1)_both]"
            }`}
            style={{ animationDelay: titleExiting ? "0ms" : "350ms" }}
          >
            YS WORLD
          </h1>
        </div>
      )}

      {showTap && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-3 px-6 sm:bottom-[12%]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="pointer-events-auto animate-[introTapPulse_2s_ease-in-out_infinite] rounded-full px-8 py-4 text-[17px] font-bold text-white shadow-[0_8px_32px_rgba(49,130,246,0.4)] transition active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, #fbbf24 0%, #38bdf8 50%, #a78bfa 100%)",
            }}
          >
            탭하여 시작
          </button>
          <p className="animate-[introTitleIn_0.6s_ease-out_both] text-[11px] text-white/50">
            WASD · Space · E · 드래그로 시점 회전
          </p>
        </div>
      )}
    </div>
  );
}
