import { getAudioContext, getSfxOutput, resumeAudioContext } from "./audioContext";

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.12,
): void {
  const audio = getAudioContext();
  const output = getSfxOutput();
  if (!audio || !output) return;

  void resumeAudioContext();

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  osc.connect(gain);
  gain.connect(output);
  osc.start();
  osc.stop(audio.currentTime + duration);
}

export function playCoinSound(): void {
  tone(880, 0.08, "sine", 0.1);
  setTimeout(() => tone(1320, 0.1, "sine", 0.08), 50);
}

export function playJumpSound(): void {
  tone(420, 0.06, "triangle", 0.08);
}

export function playLandSound(): void {
  tone(180, 0.05, "sine", 0.06);
}

export function playFlagSound(): void {
  tone(523, 0.12, "sine", 0.1);
  setTimeout(() => tone(659, 0.15, "sine", 0.08), 80);
}

export function playZoneSound(): void {
  tone(330, 0.2, "sine", 0.09);
  setTimeout(() => tone(440, 0.25, "sine", 0.07), 100);
}

export function playDiscoverySound(): void {
  tone(523, 0.1, "sine", 0.11);
  setTimeout(() => tone(784, 0.12, "sine", 0.09), 60);
  setTimeout(() => tone(1047, 0.18, "triangle", 0.08), 140);
}

/** 탐험 완료 빵빠레 */
export function playCompletionFanfare(): void {
  const melody = [
    { f: 523, d: 0.14, t: 0 },
    { f: 659, d: 0.14, t: 100 },
    { f: 784, d: 0.14, t: 200 },
    { f: 1047, d: 0.22, t: 320 },
    { f: 1318, d: 0.35, t: 480 },
    { f: 1568, d: 0.45, t: 620 },
  ] as const;

  for (const note of melody) {
    setTimeout(() => tone(note.f, note.d, "triangle", 0.13), note.t);
  }

  setTimeout(() => tone(1047, 0.08, "sine", 0.09), 900);
  setTimeout(() => tone(1318, 0.08, "sine", 0.09), 980);
  setTimeout(() => tone(1568, 0.08, "sine", 0.09), 1060);
  setTimeout(() => tone(2093, 0.5, "triangle", 0.11), 1140);
}
