import { bridgeHouseContent } from "./bridge-house";
import { failureMuseumContent } from "./failure-museum";
import { futureLabContent } from "./future-lab";
import { projectMuseumContent } from "./project-museum";
import { secretContent } from "./secret";
import { skillTowerContent } from "./skill-tower";
import { storyHouseContent } from "./story-house";
import type { ZoneContent } from "./types";

export type { ContentSection, ZoneContent } from "./types";

const ZONE_CONTENT: Record<string, ZoneContent> = {
  "story-house": storyHouseContent,
  "bridge-house": bridgeHouseContent,
  "failure-museum": failureMuseumContent,
  "project-museum": projectMuseumContent,
  "skill-tower": skillTowerContent,
  "future-lab": futureLabContent,
  "secret-cave": secretContent,
};

export function getContentByInteractionId(id: string): ZoneContent | null {
  return ZONE_CONTENT[id] ?? null;
}
