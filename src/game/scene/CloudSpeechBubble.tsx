"use client";

import { Html } from "@react-three/drei";
import { CLOUD_BUBBLE_TEXT } from "../clouds";
import type { CloudBubbleState } from "../types";

interface CloudSpeechBubbleProps {
  bubble: CloudBubbleState | null;
}

export function CloudSpeechBubble({ bubble }: CloudSpeechBubbleProps) {
  if (!bubble) return null;

  const [x, y, z] = bubble.position;
  const floatY = bubble.scale * 1.4 + 0.6;

  return (
    <Html
      position={[x, y + floatY, z]}
      center
      distanceFactor={14}
      zIndexRange={[40, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        key={bubble.tick}
        className="animate-[cloudBubble3d_2.4s_ease-out_forwards]"
      >
        <div className="relative rounded-[16px] bg-white px-4 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.2)]">
          <p className="whitespace-nowrap text-[13px] font-bold text-[#191f28]">
            {CLOUD_BUBBLE_TEXT}
          </p>
          <span
            className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
            aria-hidden
          />
        </div>
      </div>
    </Html>
  );
}
