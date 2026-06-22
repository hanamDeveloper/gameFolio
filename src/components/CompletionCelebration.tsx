"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { CONTACT } from "@/game/content/folio-narrative";

interface CompletionCelebrationProps {
  visible: boolean;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f87171",
  "#a78bfa",
  "#fcd34d",
  "#fb923c",
];

function ConfettiLayer() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: (i % 12) * 0.07,
        duration: 2.4 + (i % 5) * 0.35,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 5 + (i % 4) * 3,
        rot: (i % 6) * 60,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute -top-4 rounded-[2px]"
          style={{
            left: p.left,
            width: p.w,
            height: p.w * 0.55,
            background: p.color,
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function CompletionCelebration({
  visible,
  onClose,
}: CompletionCelebrationProps) {
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  const phoneHref = `tel:${CONTACT.phone.replace(/-/g, "")}`;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-[completionBackdrop_0.4s_ease-out_both]"
      style={{ zIndex: 9999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" />
      <ConfettiLayer />

      <div className="relative w-full max-w-sm animate-[completionSwoosh_0.65s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="overflow-hidden rounded-[24px] bg-[#f2f4f6] shadow-[0_16px_48px_rgba(0,0,0,0.22)]">
          <div className="bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 px-5 py-3 text-center">
            <p className="text-[13px] font-bold text-white drop-shadow-sm">
              🎉 탐험 완료!
            </p>
          </div>

          <div className="px-5 py-6">
            <h2
              id="completion-title"
              className="text-center text-[20px] font-bold text-[#191f28]"
            >
              YS World를 다 돌아봤어요
            </h2>
            <p className="mt-2 text-center text-[14px] leading-relaxed text-[#4e5968]">
              {CONTACT.intro}
            </p>

            <div className="mt-5 space-y-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 transition active:scale-[0.99]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-sky-100 text-[13px] font-bold text-sky-600">
                  @
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-[#8b95a1]">
                    이메일
                  </span>
                  <span className="block truncate text-[15px] font-semibold text-[#191f28]">
                    {CONTACT.email}
                  </span>
                </span>
              </a>

              <a
                href={phoneHref}
                className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 transition active:scale-[0.99]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-emerald-100 text-[13px] font-bold text-emerald-600">
                  ☎
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium text-[#8b95a1]">
                    전화
                  </span>
                  <span className="block text-[15px] font-semibold text-[#191f28]">
                    {CONTACT.phone}
                  </span>
                </span>
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 w-full rounded-full bg-[#191f28] py-3 text-[14px] font-semibold text-white transition active:scale-[0.98]"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
