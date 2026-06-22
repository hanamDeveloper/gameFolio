import type { ReactNode } from "react";
import type { ContentSection } from "@/game/content";

/** 토스 톤 — 동글동글, 부드러운 대비, 가독성 우선 */
const INK = "#191f28";
const SUB = "#4e5968";
const MUTED = "#8b95a1";
const SURFACE = "#f2f4f6";

const METRIC_PATTERN =
  /(\d[\d,]*\s*%?\s*→\s*\d[\d,]*\s*%\+?|~?\d[\d,]*\s*%\+?|\d[\d,]+\+)/g;

const CALLOUT_KEYS = [
  "문제를 이렇게",
  "요즘 현장",
  "그래서 이렇게",
  "한 줄로",
  "남은 것",
  "그때 한 일",
];

function mixAccent(accent: string, pct: number, base = "#ffffff"): string {
  return `color-mix(in srgb, ${accent} ${pct}%, ${base})`;
}

function isCategoryHeader(text: string, prev?: string): boolean {
  if (text.includes("→") || /%|~/.test(text)) return false;
  if (text.length > 38 || text.startsWith("#")) return false;
  if (!prev) return true;
  return prev.includes("→") || prev.length > 55 || /%/.test(prev);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function isShortLead(text: string): boolean {
  return text.length <= 100 && !text.includes("\n\n");
}

function RichText({
  text,
  accent,
  inline,
  size = "body",
}: {
  text: string;
  accent: string;
  inline?: boolean;
  size?: "body" | "lead";
}) {
  const parts = text.split(METRIC_PATTERN);
  const Tag = inline ? "span" : "p";

  const sizeClass =
    size === "lead"
      ? "text-[17px] font-semibold leading-[1.65] sm:text-[18px]"
      : inline
        ? "text-[15px] leading-[1.7]"
        : "text-[16px] leading-[1.85]";

  return (
    <Tag
      className={sizeClass}
      style={{
        color: size === "lead" ? INK : SUB,
        ...(inline ? {} : { margin: 0 }),
      }}
    >
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="font-semibold"
            style={{ color: accent }}
          >
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </Tag>
  );
}

function ProseBody({
  text,
  accent,
  leadFirst,
}: {
  text: string;
  accent: string;
  leadFirst?: boolean;
}) {
  const paragraphs = splitParagraphs(text);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <RichText
          key={`${para.slice(0, 24)}-${i}`}
          text={para}
          accent={accent}
          size={leadFirst && i === 0 ? "lead" : "body"}
        />
      ))}
    </div>
  );
}

function SoftCard({
  children,
  accent,
  tint,
  className = "",
}: {
  children: ReactNode;
  accent: string;
  tint?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] bg-white p-4 sm:p-5 ${className}`}
      style={{
        boxShadow: "0 2px 16px rgba(0, 0, 0, 0.04)",
        ...(tint
          ? { background: mixAccent(accent, 6) }
          : undefined),
      }}
    >
      {children}
    </div>
  );
}

function ItemList({ items, accent }: { items: string[]; accent: string }) {
  if (items[0]?.startsWith("#")) {
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1.5 text-[12px] font-medium"
            style={{
              color: SUB,
              background: mixAccent(accent, 10),
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-[14px] px-3 py-2.5"
          style={{ background: SURFACE }}
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            ✓
          </span>
          <RichText text={item} accent={accent} inline />
        </li>
      ))}
    </ul>
  );
}

function GroupedList({ items, accent }: { items: string[]; accent: string }) {
  const groups: { header?: string; items: string[] }[] = [];
  let current: { header?: string; items: string[] } = { items: [] };

  items.forEach((item, i) => {
    if (isCategoryHeader(item, items[i - 1])) {
      if (current.header || current.items.length) groups.push(current);
      current = { header: item, items: [] };
    } else {
      current.items.push(item);
    }
  });
  if (current.header || current.items.length) groups.push(current);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.header ?? group.items[0]}>
          {group.header && (
            <p
              className="mb-2 text-[12px] font-semibold"
              style={{ color: accent }}
            >
              {group.header}
            </p>
          )}
          <ItemList items={group.items} accent={accent} />
        </div>
      ))}
    </div>
  );
}

function TagList({ tags, accent }: { tags: string[]; accent: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full px-3 py-1.5 text-[12px] font-medium"
          style={{
            color: SUB,
            background: mixAccent(accent, 10),
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function LinkList({
  links,
  accent,
}: {
  links: { label: string; href: string }[];
  accent: string;
}) {
  return (
    <div className="space-y-2">
      {links.map((link) => {
        const isEmail = link.href.startsWith("mailto:");
        const isPhone = link.href.startsWith("tel:");

        return (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 rounded-[16px] px-4 py-3 transition active:scale-[0.99]"
            style={{ background: SURFACE }}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] text-[13px] font-bold"
              style={{
                background: mixAccent(accent, 14),
                color: accent,
              }}
            >
              {isEmail ? "@" : isPhone ? "☎" : "↗"}
            </span>
            <span className="min-w-0">
              <span className="block text-[12px] font-medium" style={{ color: MUTED }}>
                {isEmail ? "이메일" : isPhone ? "전화" : "링크"}
              </span>
              <span
                className="block truncate text-[14px] font-semibold"
                style={{ color: INK }}
              >
                {link.label}
              </span>
            </span>
          </a>
        );
      })}
    </div>
  );
}

export function ContentSectionBlock({
  section,
  accent,
  index,
  isFirst,
}: {
  section: ContentSection;
  accent: string;
  index: number;
  isFirst?: boolean;
}) {
  const isLead =
    isFirst &&
    section.body &&
    !section.heading &&
    isShortLead(section.body);

  const isCallout =
    section.heading &&
    CALLOUT_KEYS.some((k) => section.heading!.includes(k));

  const useGrouped =
    section.items &&
    section.items.length > 4 &&
    section.items.filter((item, i) =>
      isCategoryHeader(item, section.items![i - 1]),
    ).length >= 2;

  if (isLead && section.body) {
    return (
      <SoftCard accent={accent} tint className={index > 0 ? "mt-3" : ""}>
        <RichText text={section.body} accent={accent} size="lead" />
      </SoftCard>
    );
  }

  const isIntro =
    isFirst && section.body && !section.heading && !isLead;

  if (isIntro && section.body) {
    return (
      <SoftCard accent={accent} tint className={index > 0 ? "mt-3" : ""}>
        <ProseBody text={section.body} accent={accent} leadFirst />
      </SoftCard>
    );
  }

  const hasContent =
    section.body || section.items || section.tags || section.links;

  if (!hasContent && section.heading) return null;

  return (
    <SoftCard accent={accent} className={index > 0 ? "mt-3" : ""}>
      {section.heading && (
        <div className="mb-3">
          <h3 className="text-[15px] font-bold leading-snug" style={{ color: INK }}>
            {section.heading}
          </h3>
          {section.subtitle && (
            <p className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
              {section.subtitle}
            </p>
          )}
        </div>
      )}

      {section.body && isCallout && (
        <div
          className="rounded-[14px] px-4 py-3"
          style={{ background: mixAccent(accent, 8) }}
        >
          <RichText text={section.body} accent={accent} />
        </div>
      )}

      {section.body && !isCallout && (
        <div className={section.heading ? "mt-1" : ""}>
          <ProseBody text={section.body} accent={accent} />
        </div>
      )}

      {section.items && (
        <div className={section.body || section.heading ? "mt-4" : ""}>
          {useGrouped ? (
            <GroupedList items={section.items} accent={accent} />
          ) : (
            <ItemList items={section.items} accent={accent} />
          )}
        </div>
      )}

      {section.tags && (
        <div className={section.body || section.heading || section.items ? "mt-4" : ""}>
          <TagList tags={section.tags} accent={accent} />
        </div>
      )}

      {section.links && (
        <div
          className={
            section.body || section.heading || section.items || section.tags
              ? "mt-4"
              : ""
          }
        >
          <LinkList links={section.links} accent={accent} />
        </div>
      )}
    </SoftCard>
  );
}
