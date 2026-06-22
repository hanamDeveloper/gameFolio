import { DECORATIONS } from "./constants";

export interface CloudDef {
  id: string;
  position: [number, number, number];
  scale: number;
}

/** Landmark 구름은 부모 좌표 + 로컬 오프셋으로 월드 좌표 계산 */
const LANDMARK_CLOUDS: CloudDef[] = [
  {
    id: "cloud-tower",
    position: [1 + 2.2, 12.8 + 4.5, -10.5 - 1.8],
    scale: 1.1,
  },
  {
    id: "cloud-secret-a",
    position: [6 + 2, 14.8 + 2.2, 0.5 + 1.2],
    scale: 1.4,
  },
  {
    id: "cloud-secret-b",
    position: [6 + 2.8, 14.8 + 3, 0.5 + 1.5],
    scale: 1.1,
  },
];

export const CLOUDS: CloudDef[] = [
  ...DECORATIONS.filter((d) => d.model === "cloud").map((d, i) => ({
    id: `cloud-dec-${i}`,
    position: d.position,
    scale: d.scale ?? 1,
  })),
  ...LANDMARK_CLOUDS,
];

export const CLOUD_BUBBLE_TEXT = "구름은 못 밟아요~";

/** 플레이어가 구름 볼륨 안에 들어왔는지 */
export function findCloudAt(
  x: number,
  y: number,
  z: number,
): CloudDef | null {
  let best: CloudDef | null = null;
  let bestDist = Infinity;

  for (const cloud of CLOUDS) {
    const [cx, cy, cz] = cloud.position;
    const radius = cloud.scale * 1.35;
    const dx = x - cx;
    const dy = y - cy;
    const dz = z - cz;
    const horizontal = Math.hypot(dx, dz);

    if (horizontal > radius || Math.abs(dy) > radius * 0.95) continue;

    const dist = Math.hypot(horizontal, dy);
    if (dist < bestDist) {
      bestDist = dist;
      best = cloud;
    }
  }

  return best;
}
