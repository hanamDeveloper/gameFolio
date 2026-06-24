import { checkpointFromInteractionPlatform } from "./checkpoint";
import { INTERACTIONS } from "./constants";
import type { InteractionZone } from "./types";

export interface TravelDestination {
  id: string;
  title: string;
  subtitle: string;
  contentId: string;
  position: [number, number, number];
}

export const BUILDING_DESTINATIONS: TravelDestination[] = INTERACTIONS.map(
  (zone) => ({
    id: zone.id,
    title: zone.title,
    subtitle: zone.subtitle,
    contentId: zone.id,
    position: travelPositionFromInteraction(zone),
  }),
);

function travelPositionFromInteraction(
  zone: InteractionZone,
): [number, number, number] {
  return checkpointFromInteractionPlatform(zone.platform);
}

export function getTravelDestination(id: string): TravelDestination | null {
  return BUILDING_DESTINATIONS.find((d) => d.id === id) ?? null;
}
