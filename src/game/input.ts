export const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  interactQueued: false,
};

export function consumeInteract(): boolean {
  if (!inputState.interactQueued) return false;
  inputState.interactQueued = false;
  return true;
}

export function bindKeyboardInput(): () => void {
  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        inputState.forward = true;
        break;
      case "ArrowDown":
      case "KeyS":
        inputState.backward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        inputState.left = true;
        break;
      case "ArrowRight":
      case "KeyD":
        inputState.right = true;
        break;
      case "Space":
        inputState.jump = true;
        e.preventDefault();
        break;
      case "KeyE":
        inputState.interactQueued = true;
        e.preventDefault();
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        inputState.forward = false;
        break;
      case "ArrowDown":
      case "KeyS":
        inputState.backward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        inputState.left = false;
        break;
      case "ArrowRight":
      case "KeyD":
        inputState.right = false;
        break;
      case "Space":
        inputState.jump = false;
        break;
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}

export function setMobileMove(x: number, z: number): void {
  const threshold = 0.25;
  inputState.forward = z < -threshold;
  inputState.backward = z > threshold;
  inputState.left = x < -threshold;
  inputState.right = x > threshold;
}

export function setMobileJump(pressed: boolean): void {
  inputState.jump = pressed;
}

export function queueMobileInteract(): void {
  inputState.interactQueued = true;
}
