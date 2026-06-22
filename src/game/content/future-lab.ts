import { CONTACT, PHASE03_ABOUT } from "./folio-narrative";
import type { ZoneContent } from "./types";

export const futureLabContent: ZoneContent = {
  id: "future-lab",
  zone: "tower",
  title: "Future Lab",
  subtitle: "앞으로",
  accent: "#a78bfa",
  pages: [
    {
      id: "direction",
      title: "제품 방향",
      subtitle: "하고 싶은 일",
      sections: [
        { body: PHASE03_ABOUT[3] },
        { body: PHASE03_ABOUT[4] },
      ],
    },
    {
      id: "contact",
      title: "연락처",
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
