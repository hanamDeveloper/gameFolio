export type TeleportPosition = [number, number, number];

let pending: TeleportPosition | null = null;

export function requestTeleport(position: TeleportPosition): void {
  pending = position;
}

export function consumeTeleport(): TeleportPosition | null {
  const next = pending;
  pending = null;
  return next;
}
