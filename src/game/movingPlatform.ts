import type { MovingPlatformDef } from "./types";

export function getMovingPlatformPosition(
  def: MovingPlatformDef,
  time: number,
): [number, number, number] {
  const [bx, by, bz] = def.position;
  const offset = Math.sin(time * def.speed + (def.phase ?? 0)) * def.range;

  return [
    bx + (def.axis === "x" ? offset : 0),
    by + (def.axis === "y" ? offset : 0),
    bz + (def.axis === "z" ? offset : 0),
  ];
}

export function isMovingPlatformNearPlayer(
  def: MovingPlatformDef,
  player: [number, number, number],
): boolean {
  const [x, y, z] = def.position;
  const dy = y - player[1];
  if (dy < -8) return false;
  if (dy > 14) return false;

  const dx = x - player[0];
  const dz = z - player[2];
  return Math.hypot(dx, dz) <= 22 + def.range;
}
