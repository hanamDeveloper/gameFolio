const STORAGE_KEY = "ys-world-progress-v1";

export interface SavedProgress {
  coins: string[];
  flags: string[];
  /** 처음 방문한 건물(Interaction id) 기록 */
  buildings: string[];
  tutorialDone: boolean;
  /** 탐험 100% 축하 연출 표시 여부 */
  celebrationSeen?: boolean;
}

const DEFAULT_PROGRESS: SavedProgress = {
  coins: [],
  flags: [],
  buildings: [],
  tutorialDone: false,
};

export function loadProgress(): SavedProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      coins: Array.isArray(parsed.coins) ? parsed.coins : [],
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      buildings: Array.isArray(parsed.buildings) ? parsed.buildings : [],
      tutorialDone: Boolean(parsed.tutorialDone),
      celebrationSeen: Boolean(parsed.celebrationSeen),
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: SavedProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
