import { AUDIO } from "./constants";
import { getAudioContext, getBgmOutput, resumeAudioContext } from "./audioContext";

const BGM_PREF_KEY = "ys-world-bgm-enabled";
const NORMAL_VOLUME = 0.32;
const DUCK_VOLUME = 0.12;
const FADE_SPEED = 0.06;

let audio: HTMLAudioElement | null = null;
let source: MediaElementAudioSourceNode | null = null;
let unlocked = false;
let bgmEnabled = true;
let targetVolume = NORMAL_VOLUME;
let currentVolume = 0;
let isDucked = false;
let fadeRaf = 0;

export function loadBgmEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(BGM_PREF_KEY);
    return v === null ? true : v === "1";
  } catch {
    return true;
  }
}

export function initBgmPreference(): void {
  bgmEnabled = loadBgmEnabled();
}

export function isBgmEnabled(): boolean {
  return bgmEnabled;
}

function getAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!audio) {
    audio = new Audio(AUDIO.bgmMain);
    audio.loop = true;
    audio.preload = "auto";

    const ctx = getAudioContext();
    const output = getBgmOutput();
    if (ctx && output && !source) {
      source = ctx.createMediaElementSource(audio);
      source.connect(output);
    }
  }

  return audio;
}

function tickFade() {
  const output = getBgmOutput();
  if (!output) return;

  const diff = targetVolume - currentVolume;
  if (Math.abs(diff) < 0.008) {
    currentVolume = targetVolume;
    output.gain.value = currentVolume;
    fadeRaf = 0;
    return;
  }

  currentVolume += diff * FADE_SPEED;
  output.gain.value = Math.max(0, Math.min(1, currentVolume));
  fadeRaf = requestAnimationFrame(tickFade);
}

function scheduleFade() {
  if (fadeRaf) return;
  fadeRaf = requestAnimationFrame(tickFade);
}

function applyBgmEnabledState(): void {
  const el = getAudioElement();
  const output = getBgmOutput();

  if (!bgmEnabled) {
    if (el && !el.paused) el.pause();
    targetVolume = 0;
    currentVolume = 0;
    if (output) output.gain.value = 0;
    if (fadeRaf) {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = 0;
    }
    return;
  }

  if (!unlocked || !el) return;

  targetVolume = isDucked ? DUCK_VOLUME : NORMAL_VOLUME;
  void el.play().catch(() => {});
  scheduleFade();
}

export function setBgmEnabled(enabled: boolean): void {
  bgmEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem(BGM_PREF_KEY, enabled ? "1" : "0");
  }
  applyBgmEnabledState();
}

export function toggleBgmEnabled(): boolean {
  setBgmEnabled(!bgmEnabled);
  return bgmEnabled;
}

export function setBgmDucked(ducked: boolean): void {
  isDucked = ducked;
  if (!bgmEnabled) {
    targetVolume = 0;
    scheduleFade();
    return;
  }
  targetVolume = ducked ? DUCK_VOLUME : NORMAL_VOLUME;
  scheduleFade();
}

/** Game Start 등 사용자 제스처 후 오디오 unlock + BGM 재생 */
export async function unlockGameAudio(): Promise<void> {
  await resumeAudioContext();
  unlocked = true;
  if (!bgmEnabled) return;

  const el = getAudioElement();
  if (!el) return;

  try {
    await el.play();
    targetVolume = NORMAL_VOLUME;
    scheduleFade();
  } catch {
    unlocked = false;
  }
}
