import type { ContentLink, ContentPage, ContentSection } from "./types";
import type { SideProject, WorkExperience } from "./folio-data";

function toLinks(links?: { name: string; url: string }[]): ContentLink[] | undefined {
  if (!links?.length) return undefined;
  return links.map((l) => ({ label: l.name, href: l.url }));
}

function workSections(work: WorkExperience): ContentSection[] {
  const sections: ContentSection[] = [{ body: work.description }];

  if (work.summary) {
    sections.push({
      heading: "요약",
      body: work.summary,
    });
  }
  if (work.details?.length) {
    sections.push({ heading: "했던 일", items: work.details });
  }
  if (work.tech?.length) sections.push({ tags: work.tech });
  const links = toLinks(work.links);
  if (links) sections.push({ links });

  return sections;
}

function projectSections(project: SideProject): ContentSection[] {
  const sections: ContentSection[] = [
    { body: project.summary ?? project.description },
  ];

  if (project.details?.length) {
    sections.push({ heading: "했던 일", items: project.details });
  }
  if (project.tech?.length) sections.push({ tags: project.tech });
  const links = toLinks(project.links);
  if (links) sections.push({ links });

  return sections;
}

export function workToPage(work: WorkExperience, id: string): ContentPage {
  return {
    id,
    title: work.company,
    subtitle: `${work.role} · ${work.period}`,
    sections: workSections(work),
  };
}

export function projectToPage(project: SideProject, id: string): ContentPage {
  return {
    id,
    title: project.title,
    subtitle: [project.role, project.period].filter(Boolean).join(" · "),
    sections: projectSections(project),
  };
}
