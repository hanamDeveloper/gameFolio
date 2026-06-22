import type { ZoneId } from "../types";

export interface ContentLink {
  label: string;
  href: string;
}

export interface ContentSection {
  heading?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  links?: ContentLink[];
  /** 기술 스택 태그 */
  tags?: string[];
}

export interface ContentPage {
  id: string;
  title: string;
  subtitle?: string;
  sections: ContentSection[];
}

export interface ZoneContent {
  id: string;
  zone: ZoneId;
  title: string;
  subtitle: string;
  accent: string;
  pages: ContentPage[];
}
