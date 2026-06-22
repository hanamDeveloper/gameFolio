"use client";

const STEPS = [
  {
    title: "이동",
    body: "WASD나 방향키로 움직여요. 화면을 드래그하면 시점만 돌아가고 캐릭터는 그대로입니다.",
  },
  {
    title: "점프",
    body: "Space로 두 번 점프할 수 있어요. 벽에 붙으면 공중에서 한 번 더 — 벽 점프는 떨어지기 전에 한 번만 됩니다.",
  },
  {
    title: "탐험",
    body: "떨어지면 구역 처음으로 돌아갑니다. 노란 링 발판은 움직이니까 타이밍 맞춰 점프하세요.",
  },
  {
    title: "건물 입장",
    body: "건물 발판 위에서 E를 누르면 들어갈 수 있어요. 나선길 따라 올라가며 내용을 읽어보세요.",
  },
];

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialOverlay({ step, onNext, onSkip }: TutorialOverlayProps) {
  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-end justify-center pb-28 sm:pb-24">
      <div className="pointer-events-auto mx-4 w-full max-w-md rounded-2xl border border-white/15 bg-black/75 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wide text-amber-300/70">
            안내 {step + 1}/{STEPS.length}
          </span>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs text-white/40 transition hover:text-white/70"
          >
            건너뛰기
          </button>
        </div>
        <h3 className="mb-2 text-xl font-bold text-white">{current.title}</h3>
        <p className="mb-5 text-sm leading-6 text-white/60">{current.body}</p>
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-amber-400/80" : "bg-white/10"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onNext}
          className="mt-5 w-full rounded-lg bg-amber-500/25 py-2.5 text-sm font-semibold text-amber-100 ring-1 ring-amber-400/30 transition hover:bg-amber-500/35"
        >
          {isLast ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  );
}
