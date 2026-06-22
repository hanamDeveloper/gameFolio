import * as THREE from "three";

export const MIN_PITCH = 0.35;
export const MAX_PITCH = 1.05;
export const MIN_CAMERA_DISTANCE = 6;
export const MANUAL_OVERRIDE_MS = 3500;

/** 기본 탐험 시점 — 인트로 종료·게임플레이 공통 (높은 3인칭) */
export const DEFAULT_CAMERA = {
  yaw: 0.5,
  pitch: 0.56,
  distance: 25,
  yBoost: 2.5,
};

export const cameraState = {
  yaw: DEFAULT_CAMERA.yaw,
  pitch: DEFAULT_CAMERA.pitch,
  distance: DEFAULT_CAMERA.distance,
  manualOverrideUntil: 0,
};

export function resetCameraToDefault(): void {
  cameraState.yaw = DEFAULT_CAMERA.yaw;
  cameraState.pitch = DEFAULT_CAMERA.pitch;
  cameraState.distance = DEFAULT_CAMERA.distance;
  cameraState.manualOverrideUntil = 0;
}

const YAW_SENSITIVITY = 0.004;
const PITCH_SENSITIVITY = 0.003;

export function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * t;
}

export function markManualCameraOverride() {
  cameraState.manualOverrideUntil = performance.now() + MANUAL_OVERRIDE_MS;
}

export function rotateCamera(deltaX: number, deltaY: number) {
  markManualCameraOverride();
  cameraState.yaw -= deltaX * YAW_SENSITIVITY;
  cameraState.pitch = THREE.MathUtils.clamp(
    cameraState.pitch + deltaY * PITCH_SENSITIVITY,
    MIN_PITCH,
    MAX_PITCH,
  );
}

export function bindCameraDrag(
  element: HTMLElement,
  isDisabled: () => boolean,
): () => void {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (isDisabled() || e.button !== 0) return;
    markManualCameraOverride();
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    element.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging) return;
    markManualCameraOverride();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    rotateCamera(dx, dy);
  };

  const endDrag = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (element.hasPointerCapture(e.pointerId)) {
      element.releasePointerCapture(e.pointerId);
    }
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", endDrag);
  element.addEventListener("pointercancel", endDrag);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", endDrag);
    element.removeEventListener("pointercancel", endDrag);
  };
}

const FADE_OPACITY = 0.28;
const savedOpacities = new WeakMap<THREE.Material, number>();
const fadedThisFrame = new Set<THREE.Material>();

export function restoreFadedMaterials() {
  for (const mat of fadedThisFrame) {
    const original = savedOpacities.get(mat);
    if (original === undefined) continue;
    mat.opacity = original;
    mat.transparent = original < 1;
    mat.depthWrite = original >= 0.95;
    mat.needsUpdate = true;
  }
  fadedThisFrame.clear();
}

export function fadeOccludingMesh(mesh: THREE.Object3D) {
  if (!(mesh instanceof THREE.Mesh)) return;
  const materials = Array.isArray(mesh.material)
    ? mesh.material
    : [mesh.material];

  for (const mat of materials) {
    if (!(mat instanceof THREE.MeshBasicMaterial)) continue;
    if (!savedOpacities.has(mat)) {
      savedOpacities.set(mat, mat.opacity);
    }
    mat.transparent = true;
    mat.opacity = FADE_OPACITY;
    mat.depthWrite = false;
    mat.needsUpdate = true;
    fadedThisFrame.add(mat);
  }
}

export function shouldSkipCameraRay(object: THREE.Object3D): boolean {
  let node: THREE.Object3D | null = object;
  while (node) {
    if (node.userData?.skipCameraRay) return true;
    node = node.parent;
  }
  return false;
}

export function shouldFadeOnOcclude(object: THREE.Object3D): boolean {
  let node: THREE.Object3D | null = object;
  while (node) {
    if (node.userData?.cameraFade) return true;
    node = node.parent;
  }
  return false;
}
