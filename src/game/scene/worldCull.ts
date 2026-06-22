/** 플레이어 주변 월드 오브젝트만 렌더링하기 위한 거리 기준 */

export const WORLD_CULL = {
  /** 플레이어보다 이만큼 아래면 숨김 (지나온 발판) */
  belowY: 6,
  /** 플레이어보다 이만큼 위까지 표시 (앞으로 갈 길) */
  aboveY: 11,
  /** 수평(XZ) 거리 — 나선 경로 여유 */
  horizontal: 22,
} as const;

export function isNearPlayer(
  position: [number, number, number],
  player: [number, number, number],
): boolean {
  const dy = position[1] - player[1];
  if (dy < -WORLD_CULL.belowY) return false;
  if (dy > WORLD_CULL.aboveY) return false;

  const dx = position[0] - player[0];
  const dz = position[2] - player[2];
  if (Math.hypot(dx, dz) > WORLD_CULL.horizontal) return false;

  return true;
}
