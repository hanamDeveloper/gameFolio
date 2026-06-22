import { INTERACTIONS } from "./constants";

const BUILDING_ORDER = [
  "story-house",
  "bridge-house",
  "failure-museum",
  "project-museum",
  "skill-tower",
  "future-lab",
  "secret-cave",
] as const;

export interface QuestProgress {
  buildingsVisited: string[];
  coinsCollected: number;
  flagsDiscovered: number;
  totalCoins: number;
  totalFlags: number;
}

export function getActiveQuest(progress: QuestProgress): string {
  const buildingById = new Map(INTERACTIONS.map((i) => [i.id, i]));

  for (const id of BUILDING_ORDER) {
    if (!buildingById.has(id)) continue;
    if (!progress.buildingsVisited.includes(id)) {
      const meta = buildingById.get(id)!;
      return `${meta.title}에 도착하기`;
    }
  }

  if (progress.coinsCollected < progress.totalCoins) {
    return `모든 코인 모으기 (${progress.coinsCollected}/${progress.totalCoins})`;
  }

  if (progress.flagsDiscovered < progress.totalFlags) {
    return `깃발 다 찾기 (${progress.flagsDiscovered}/${progress.totalFlags})`;
  }

  return "";
}

/** 건물·코인·깃발 전부 완료 */
export function isExplorationComplete(progress: QuestProgress): boolean {
  if (progress.coinsCollected < progress.totalCoins) return false;
  if (progress.flagsDiscovered < progress.totalFlags) return false;
  return INTERACTIONS.every((i) => progress.buildingsVisited.includes(i.id));
}

/** 퀘스트 종류가 바뀌었는지 (카운트만 변한 경우 false) */
export function isQuestMilestone(prev: string, next: string): boolean {
  if (!prev || !next) return prev !== next;
  const strip = (q: string) => q.replace(/\s*\(\d+\/\d+\)$/, "");
  return strip(prev) !== strip(next);
}
