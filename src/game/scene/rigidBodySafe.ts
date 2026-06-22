import type { RapierRigidBody } from "@react-three/rapier";

export function readRigidBodyMotion(body: RapierRigidBody): {
  x: number;
  y: number;
  z: number;
  vy: number;
} | null {
  try {
    if (!body.isValid()) return null;
    const pos = body.translation();
    const vel = body.linvel();
    return { x: pos.x, y: pos.y, z: pos.z, vy: vel.y };
  } catch {
    return null;
  }
}
