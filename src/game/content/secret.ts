import { CONTACT, HERO, PHASE02_TAGS } from "./folio-narrative";
import type { ZoneContent } from "./types";

export const secretContent: ZoneContent = {
  id: "secret-cave",
  zone: "secret",
  title: "Secret Area",
  subtitle: "숨겨둔 메모",
  accent: "#22d3ee",
  pages: [
    {
      id: "tags",
      title: "해시태그",
      sections: [
        { tags: [...PHASE02_TAGS] },
        { body: HERO.tagline },
        { body: HERO.body },
      ],
    },
    {
      id: "numbers",
      title: "숫자로 보면",
      sections: [
        {
          items: [
            "우수사원 4회 (제이스톡)",
            "사원 → 리드 개발자 → 프론트엔드 파트장",
            "KeepUp 참여율 5% → 30%+, 유지율 65%",
            "더탁 업로드 ~80%, 초기 로딩 60%+ 개선",
            "제이스톡 웹뷰 전환 ~70%, 9+ 프론트 프로젝트",
            "휴넷 B2B 위젯 통담당, 추천 인력 실무 투입",
          ],
        },
      ],
    },
    {
      id: "memo",
      title: "메모",
      sections: [
        {
          body: "같이 일한 사람이 다시 찾고 싶은 동료가 되는 게 목표입니다. 복잡해도 정리하고 끝까지 밀어붙이는 편이에요.",
        },
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
