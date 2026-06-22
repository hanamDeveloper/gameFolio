let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let bgmGain: GainNode | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1.35;
    sfxGain.connect(masterGain);

    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.connect(masterGain);
  }

  return ctx;
}

export function getSfxOutput(): GainNode | null {
  getAudioContext();
  return sfxGain;
}

export function getBgmOutput(): GainNode | null {
  getAudioContext();
  return bgmGain;
}

export async function resumeAudioContext(): Promise<void> {
  const audio = getAudioContext();
  if (!audio || audio.state !== "suspended") return;
  await audio.resume();
}
