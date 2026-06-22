import { sideProjects, workExperience } from "./folio-data";
import { projectToPage, workToPage } from "./folio-builders";
import type { ZoneContent } from "./types";

export const projectMuseumContent: ZoneContent = {
  id: "project-museum",
  zone: "museum",
  title: "Project Museum",
  subtitle: "경력 · 사이드",
  accent: "#fcd34d",
  pages: [
    ...workExperience.map((w, i) => workToPage(w, `work-${i}`)),
    ...sideProjects.map((p, i) => projectToPage(p, `project-${i}`)),
  ],
};
