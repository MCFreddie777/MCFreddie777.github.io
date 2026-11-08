import data from "../../content/data.json";
import site from "../site.config.json";
import * as m from "../paraglide/messages.js";
import { baseLocale, locales } from "../paraglide/runtime.js";

// Text comes from Paraglide (messages/<lang>.json, compiled to src/paraglide/). Languages are listed in
// project.inlang/settings.json. Paraglide's locale is set per page by src/middleware.ts.
export const langs = locales as readonly string[];
export const defaultLang = baseLocale as string;
export { data, m, site };

/** A message by its key, for keys stored in data (e.g. a project's descriptionTranslationKey). Use m.key() for fixed keys. */
export const t = (key: string, fallback = key): string => (m as any)[key]?.() ?? fallback;

/** Paraglide messages are plain strings, so a list is stored as numbered keys: quests_1, quests_2, … */
export const list = (key: string): string[] => {
  const items: string[] = [];
  for (let i = 1; (m as any)[`${key}_${i}`]; i++) items.push(t(`${key}_${i}`));
  return items;
};

/** Dotted lookup into a plain object (data.json): tr(data, "sectionHeadings.career"). Falls back to the key itself. */
export const tr = (o: any, key: string): string => key.split(".").reduce((x, k) => (x == null ? x : x[k]), o) ?? key;

/** Internal hrefs ("/", "/projects/") get the language prefix; full URLs stay as they are. */
export const localHref = (lang: string, href: string) => (href.startsWith("/") ? `/${lang}${href}` : href);
export const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Turns [text](link:<id>) in a message into a link to the socialLinks entry with that id. */
export const resolveLinks = (s: string) =>
  s.replace(/\[(.+?)\]\(link:([\w-]+)\)/g, (_m, text, id) => {
    const l = data.socialLinks.find((x: any) => x.id === id);
    return l ? `<a href="${l.href}">${text}</a>` : text;
  });

// shortcut: only **bold** and [text](url); upgrade to a real markdown lib if strings need more.
export const md = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

// Same syntax, but **emphasis** becomes the highlighter-marker look.
export const mk = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "<mark>$1</mark>");
