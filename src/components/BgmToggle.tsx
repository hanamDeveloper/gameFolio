"use client";

interface BgmToggleProps {
  enabled: boolean;
  onToggle: () => void;
  /** 시작 화면용 큰 사이즈 */
  size?: "md" | "sm";
}

export function BgmToggle({ enabled, onToggle, size = "md" }: BgmToggleProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full font-semibold transition active:scale-[0.97] ${
        isSm ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-[13px]"
      } ${
        enabled
          ? "bg-sky-100 text-sky-700"
          : "bg-[#e8ebef] text-[#8b95a1]"
      }`}
      aria-pressed={enabled}
      aria-label={enabled ? "BGM 끄기" : "BGM 켜기"}
    >
      <span
        className={`flex items-center justify-center rounded-full font-bold text-white ${
          isSm ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-[11px]"
        }`}
        style={{
          background: enabled
            ? "linear-gradient(135deg, #38bdf8, #818cf8)"
            : "#b0b8c1",
        }}
      >
        ♪
      </span>
      BGM {enabled ? "On" : "Off"}
    </button>
  );
}
