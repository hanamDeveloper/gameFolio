import type { ZoneId } from "./types";

export interface ZoneTheme {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  hemiSky: string;
  hemiGround: string;
  ambient: number;
  dirIntensity: number;
}

export const ZONE_THEMES: Record<ZoneId, ZoneTheme> = {
  home: {
    background: "#87a8c8",
    fog: "#a8c0d8",
    fogNear: 35,
    fogFar: 100,
    hemiSky: "#dff0ff",
    hemiGround: "#8a7050",
    ambient: 0.85,
    dirIntensity: 2.2,
  },
  storyHouse: {
    background: "#9a8878",
    fog: "#c4b4a0",
    fogNear: 32,
    fogFar: 98,
    hemiSky: "#ffe8c8",
    hemiGround: "#6a5040",
    ambient: 0.9,
    dirIntensity: 2.4,
  },
  museum: {
    background: "#788898",
    fog: "#98a8b8",
    fogNear: 30,
    fogFar: 95,
    hemiSky: "#e8f0ff",
    hemiGround: "#505868",
    ambient: 0.88,
    dirIntensity: 2.0,
  },
  tower: {
    background: "#687898",
    fog: "#8898b8",
    fogNear: 28,
    fogFar: 92,
    hemiSky: "#c8d8ff",
    hemiGround: "#404860",
    ambient: 0.82,
    dirIntensity: 1.9,
  },
  secret: {
    background: "#506878",
    fog: "#608898",
    fogNear: 25,
    fogFar: 88,
    hemiSky: "#a0e8ff",
    hemiGround: "#304050",
    ambient: 0.78,
    dirIntensity: 1.7,
  },
};

export const ZONE_LABELS: Record<ZoneId, string> = {
  home: "Home / Village",
  storyHouse: "Story House",
  museum: "Project Museum",
  tower: "Skill Tower",
  secret: "Secret Area",
};
