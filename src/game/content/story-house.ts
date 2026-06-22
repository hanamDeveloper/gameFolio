import {
  CONTACT,
  HERO,
  INTRO_TYPING,
  PHASE01,
  PHASE02_BLOCKS,
  PHASE02_TAGS,
  PHASE03_ABOUT,
} from "./folio-narrative";
import type { ZoneContent } from "./types";

export const storyHouseContent: ZoneContent = {
  id: "story-house",
  zone: "storyHouse",
  title: "Story House",
  subtitle: "김영섭 · 프론트엔드",
  accent: "#fbbf24",
  pages: [
    {
      id: "intro",
      title: "안녕하세요",
      subtitle: "소개",
      sections: [
        { body: HERO.tagline },
        { body: HERO.body },
        {
          heading: "자주 쓰는 말",
          items: [...INTRO_TYPING],
        },
      ],
    },
    {
      id: "strength",
      title: "일하는 방식",
      subtitle: "제품 · 사용자 · 조직",
      sections: [
        { body: PHASE01.subtitle },
        {
          heading: "이런 상황, 자주 봤어요",
          items: [...PHASE01.implications],
        },
        { heading: "문제를 이렇게 봅니다", body: PHASE01.insight },
        { heading: "요즘 현장에서는", body: PHASE01.trend },
        { heading: "그래서 이렇게 합니다", body: PHASE01.navigate },
        { heading: "한 줄로 말하면", body: PHASE01.coreStrength },
        ...PHASE01.domainStrengths.map((d) => ({
          heading: d.title,
          body: d.body,
        })),
      ],
    },
    {
      id: "execution",
      title: "팀에서 한 일",
      subtitle: "리더십 · 팀",
      sections: [
        {
          body: "직함보다 맡은 일의 범위가 넓어졌습니다. 팀이 흐트러졌을 때 다시 움직이게 만든 경험도 있고, 기획부터 운영까지 끝까지 본 프로젝트도 있습니다.",
        },
        { tags: [...PHASE02_TAGS] },
        ...PHASE02_BLOCKS.map((b) => ({
          heading: b.name,
          body: b.body,
        })),
      ],
    },
    {
      id: "about",
      title: "기술과 경험",
      subtitle: "기술 · 경험",
      sections: PHASE03_ABOUT.map((p) => ({ body: p })),
    },
    {
      id: "contact",
      title: "연락처",
      subtitle: "연락",
      sections: [
        { body: CONTACT.intro },
        {
          links: [
            { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
            { label: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/-/g, "")}` },
          ],
        },
      ],
    },
  ],
};
