import { workExperience } from "./folio-data";
import { PHASE01, PHASE03_ABOUT, SKILLS } from "./folio-narrative";
import type { ZoneContent } from "./types";

const allTech = [
  ...new Set(workExperience.flatMap((w) => w.tech ?? [])),
];

export const skillTowerContent: ZoneContent = {
  id: "skill-tower",
  zone: "tower",
  title: "Skill Tower",
  subtitle: "쓰는 기술",
  accent: "#60a5fa",
  pages: [
    {
      id: "skills",
      title: "기술 스택",
      subtitle: "주로 쓰는 것",
      sections: [
        {
          heading: "언어",
          tags: SKILLS.filter((s) => s.category === "Language").map((s) => s.name),
        },
        {
          heading: "프론트엔드",
          tags: SKILLS.filter((s) => s.category === "Frontend").map((s) => s.name),
        },
        {
          heading: "모바일",
          tags: SKILLS.filter((s) => s.category === "Mobile").map((s) => s.name),
        },
        {
          heading: "상태 관리",
          tags: SKILLS.filter((s) => s.category === "State Management").map(
            (s) => s.name,
          ),
        },
        {
          heading: "백엔드 · DB",
          tags: SKILLS.filter((s) =>
            ["Backend", "Database"].includes(s.category),
          ).map((s) => s.name),
        },
        {
          heading: "스타일링",
          tags: SKILLS.filter((s) => s.category === "Styling").map((s) => s.name),
        },
      ],
    },
    {
      id: "career-tech",
      title: "경력에서 쓴 기술",
      subtitle: "경력에서",
      sections: [
        {
          tags: allTech,
        },
        ...workExperience
          .filter((w) => w.tech?.length)
          .map((w) => ({
            heading: w.company,
            tags: w.tech,
          })),
      ],
    },
    {
      id: "domain",
      title: "잘 맞는 분야",
      subtitle: "도메인",
      sections: [
        ...PHASE01.domainStrengths.map((d) => ({
          heading: d.title,
          body: d.body,
        })),
        {
          heading: "소개",
          body: PHASE03_ABOUT[0],
        },
        {
          body: PHASE03_ABOUT[1],
        },
      ],
    },
  ],
};
