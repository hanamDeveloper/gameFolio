"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ContentSectionBlock } from "@/components/contentSection";
import type { ZoneContent } from "@/game/content";

interface ContentOverlayProps {
  content: ZoneContent;
  onClose: () => void;
}

type OverlayPhase = "open" | "closing";

const CLOSE_MS = 280;

const BUILDING_BADGE: Record<string, string> = {
  "story-house": "S",
  "bridge-house": "B",
  "failure-museum": "F",
  "project-museum": "P",
  "skill-tower": "T",
  "future-lab": "L",
  "secret-cave": "?",
};

function mixAccent(accent: string, pct: number, base = "#ffffff"): string {
  return `color-mix(in srgb, ${accent} ${pct}%, ${base})`;
}

function BuildingBadge({
  id,
  accent,
  size = "md",
}: {
  id: string;
  accent: string;
  size?: "md" | "lg";
}) {
  const letter = BUILDING_BADGE[id] ?? "Y";
  const dim = size === "lg" ? "h-[72px] w-[72px] text-[28px]" : "h-12 w-12 text-[18px]";

  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-[22px] font-bold`}
      style={{
        background: mixAccent(accent, 16),
        color: accent,
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      {letter}
    </div>
  );
}

function NavButton({
  children,
  onClick,
  accent,
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  accent: string;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}) {
  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 ${
        isPrimary ? "text-white" : ""
      }`}
      style={
        isPrimary
          ? { background: accent }
          : {
              background: "#f2f4f6",
              color: "#4e5968",
            }
      }
    >
      {children}
    </button>
  );
}

export function ContentOverlay({ content, onClose }: ContentOverlayProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [phase, setPhase] = useState<OverlayPhase>("open");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pages = content.pages;
  const page = pages[pageIndex];
  const isLastPage = pageIndex >= pages.length - 1;
  const accent = content.accent;

  const requestClose = useCallback(() => {
    if (phase === "closing") return;
    setPhase("closing");
    closeTimer.current = setTimeout(() => onClose(), CLOSE_MS);
  }, [onClose, phase]);

  useEffect(() => {
    setPageIndex(0);
    setPhase("open");
  }, [content.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const goNext = () => {
    if (isLastPage) requestClose();
    else setPageIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (pageIndex > 0) setPageIndex((i) => i - 1);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-[6px] sm:p-8 ${
        phase === "closing"
          ? "animate-[overlayBackdropOut_0.28s_ease-in_both]"
          : "animate-[overlayBackdropIn_0.32s_ease-out_both]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-page-title"
      onClick={requestClose}
    >
      <div
        className={`flex max-h-[min(88vh,820px)] w-full max-w-5xl overflow-hidden rounded-[24px] bg-[#f2f4f6] shadow-[0_8px_40px_rgba(0,0,0,0.12)] ${
          phase === "closing"
            ? "animate-[overlayPanelOut_0.28s_ease-in_both]"
            : "animate-[overlayPanelIn_0.32s_ease-out_both]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <aside className="hidden w-[232px] shrink-0 flex-col bg-[#eef0f3] px-4 py-6 lg:flex">
          <div className="flex flex-col items-center px-2 pt-2 text-center">
            <BuildingBadge id={content.id} accent={accent} size="lg" />
            <p className="mt-4 text-[13px] font-bold text-[#191f28]">{content.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#8b95a1]">
              {content.subtitle}
            </p>
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto px-1">
            {pages.map((p, i) => {
              const active = i === pageIndex;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPageIndex(i)}
                  className="rounded-[14px] px-3 py-2.5 text-left text-[13px] font-medium transition"
                  style={
                    active
                      ? {
                          background: "#ffffff",
                          color: "#191f28",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }
                      : { color: "#8b95a1" }
                  }
                >
                  <span
                    className="mr-2 text-[11px] font-semibold tabular-nums"
                    style={{ color: active ? accent : "#b0b8c1" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.title}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f2f4f6]">
          <header className="flex shrink-0 items-center gap-3 bg-white px-5 py-4 sm:px-6">
            <div className="lg:hidden">
              <BuildingBadge id={content.id} accent={accent} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-[#8b95a1] lg:hidden">
                {content.title} · {pageIndex + 1}/{pages.length}
              </p>
              <p className="hidden text-[12px] font-medium text-[#8b95a1] lg:block">
                {content.title}
              </p>
              <h2
                id="content-page-title"
                className="mt-0.5 truncate text-[20px] font-bold text-[#191f28] sm:text-[22px]"
              >
                {page.title}
              </h2>
              {page.subtitle && (
                <p className="mt-0.5 truncate text-[13px] text-[#8b95a1]">
                  {page.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={requestClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2f4f6] text-[#8b95a1] transition hover:bg-[#e8ebef] hover:text-[#4e5968]"
              aria-label="닫기"
            >
              ✕
            </button>
          </header>

          <div className="flex shrink-0 gap-2 overflow-x-auto px-4 py-3 lg:hidden">
            {pages.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPageIndex(i)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition"
                style={
                  i === pageIndex
                    ? { background: accent, color: "#fff" }
                    : { background: "#fff", color: "#8b95a1" }
                }
              >
                {p.title}
              </button>
            ))}
          </div>

          <div
            key={`${content.id}-${pageIndex}`}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
          >
            <div className="mx-auto max-w-xl space-y-3">
              {page.sections.map((section, i) => (
                <ContentSectionBlock
                  key={`${section.heading ?? "body"}-${i}`}
                  section={section}
                  accent={accent}
                  index={i}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e8ebef] bg-white px-5 py-4 sm:px-6">
            <p className="hidden text-[12px] text-[#8b95a1] sm:block">
              Esc · {pageIndex + 1}/{pages.length}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <NavButton
                onClick={goPrev}
                accent={accent}
                variant="ghost"
                disabled={pageIndex === 0}
              >
                이전
              </NavButton>
              <NavButton onClick={goNext} accent={accent} variant="primary">
                {isLastPage ? "닫기" : "다음"}
              </NavButton>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
