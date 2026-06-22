export type IntroPhase = "idle" | "title" | "zoom" | "ready";

export const INTRO_TIMING = {
  titleHoldMs: 2600,
  zoomDurationMs: 4800,
} as const;

/** 구름 위에서 숲 전체를 내려다보는 오프닝 샷 */
export const INTRO_CAMERA = {
  overviewPosition: [2, 54, 44] as [number, number, number],
  overviewLookAt: [2, 7, 0] as [number, number, number],
  overviewFov: 56,
  gameFov: 45,
} as const;

const ovDx = INTRO_CAMERA.overviewPosition[0] - INTRO_CAMERA.overviewLookAt[0];
const ovDy = INTRO_CAMERA.overviewPosition[1] - INTRO_CAMERA.overviewLookAt[1];
const ovDz = INTRO_CAMERA.overviewPosition[2] - INTRO_CAMERA.overviewLookAt[2];
const ovDist = Math.hypot(ovDx, ovDy, ovDz);

/** 오프닝 샷의 구면 좌표 — 줌인 시 게임 카메라 궤도로 보간 */
export const INTRO_ORBIT = {
  distance: ovDist,
  yaw: Math.atan2(ovDx, ovDz),
  pitch: Math.asin(Math.max(-1, Math.min(1, ovDy / ovDist))),
  yBoost: 0,
} as const;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
