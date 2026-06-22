"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export interface QuestRevealPayload {
  quest: string;
  id: number;
}

interface QuestRevealProps {
  payload: QuestRevealPayload | null;
  onComplete: () => void;
}

type Phase = "idle" | "hero" | "fly" | "done";

function QuestCard({ quest, compact }: { quest: string; compact?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-[999px] border border-sky-200/90 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.35)] ${
        compact ? "px-3 py-1.5 text-[10px]" : "px-6 py-3.5 text-sm"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white shadow-[0_3px_0_rgba(15,23,42,0.25)] ${
          compact ? "h-5 w-5 text-[10px]" : "h-8 w-8 text-sm"
        }`}
      >
        Q
      </span>
      {!compact && (
        <span className="text-[11px] font-bold text-sky-500">
          새 목표
        </span>
      )}
      <span
        className={`font-bold text-slate-900 ${compact ? "text-[11px]" : "text-base"}`}
      >
        {quest}
      </span>
    </div>
  );
}

export function QuestReveal({ payload, onComplete }: QuestRevealProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [flyStyle, setFlyStyle] = useState<CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!payload) {
      setPhase("idle");
      return;
    }

    setPhase("hero");
    setFlyStyle({});

    const holdTimer = window.setTimeout(() => {
      const chip = document.getElementById("quest-chip");
      const card = cardRef.current;

      if (!chip || !card) {
        setPhase("done");
        onCompleteRef.current();
        return;
      }

      const chipRect = chip.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const targetX = chipRect.left + chipRect.width / 2;
      const targetY = chipRect.top + chipRect.height / 2;

      setFlyStyle({
        position: "fixed",
        left: startX,
        top: startY,
        transform: "translate(-50%, -50%) scale(1)",
        opacity: 1,
        zIndex: 110,
      });

      setPhase("fly");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const scale = Math.min(
            0.65,
            Math.max(0.45, chipRect.width / Math.max(cardRect.width, 1)),
          );

          setFlyStyle({
            position: "fixed",
            left: targetX,
            top: targetY,
            transform: `translate(-50%, -50%) scale(${scale})`,
            opacity: 0,
            zIndex: 110,
            transition:
              "left 0.9s cubic-bezier(0.22, 1, 0.36, 1), top 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s ease, opacity 0.9s ease",
          });
        });
      });

      const doneTimer = window.setTimeout(() => {
        setPhase("done");
        onCompleteRef.current();
      }, 950);
      timersRef.current.push(doneTimer);
    }, 1200);

    timersRef.current.push(holdTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [payload?.id]);

  if (!payload || phase === "idle" || phase === "done") return null;

  if (phase === "hero") {
    return (
      <div className="pointer-events-none fixed inset-0 z-[110]">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={cardRef} className="animate-[questPopIn_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            <QuestCard quest={payload.quest} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} style={flyStyle} className="pointer-events-none">
      <QuestCard quest={payload.quest} />
    </div>
  );
}
