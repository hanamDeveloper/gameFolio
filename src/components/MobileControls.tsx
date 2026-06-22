"use client";

import { useCallback, useRef, useState } from "react";
import { queueMobileInteract, setMobileJump, setMobileMove } from "@/game/input";

interface MobileControlsProps {
  disabled: boolean;
  showEnter?: boolean;
  onEnter?: () => void;
}

export function MobileControls({
  disabled,
  showEnter,
  onEnter,
}: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [jumping, setJumping] = useState(false);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = joystickRef.current;
      if (!el || disabled) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (clientX - cx) / (rect.width / 2);
      const dy = (clientY - cy) / (rect.height / 2);
      const len = Math.hypot(dx, dy);
      const clamped = len > 1 ? 1 / len : 1;
      setMobileMove(dx * clamped, dy * clamped);
    },
    [disabled],
  );

  const resetMove = useCallback(() => {
    setMobileMove(0, 0);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-between p-4 sm:hidden">
      <div
        ref={joystickRef}
        className="pointer-events-auto relative h-28 w-28 rounded-full border border-white/15 bg-black/30 backdrop-blur-md"
        onTouchStart={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => {
          e.preventDefault();
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={resetMove}
        onTouchCancel={resetMove}
        aria-label="이동 조이스틱"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-white/15 ring-1 ring-white/20" />
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        {showEnter && onEnter && (
          <button
            type="button"
            disabled={disabled}
            onClick={onEnter}
            className="pointer-events-auto rounded-full border border-amber-300/40 bg-amber-500/25 px-5 py-2.5 text-sm font-bold text-amber-100 backdrop-blur-md"
          >
            입장
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          className={`pointer-events-auto h-20 w-20 rounded-full border text-sm font-bold backdrop-blur-md transition ${
            jumping
              ? "border-sky-300/50 bg-sky-500/30 text-sky-100"
              : "border-white/20 bg-black/30 text-white/80"
          }`}
          aria-label="점프"
          onTouchStart={() => {
            setJumping(true);
            setMobileJump(true);
          }}
          onTouchEnd={() => {
            setJumping(false);
            setMobileJump(false);
          }}
          onTouchCancel={() => {
            setJumping(false);
            setMobileJump(false);
          }}
        >
          Jump
        </button>
      </div>
    </div>
  );
}
