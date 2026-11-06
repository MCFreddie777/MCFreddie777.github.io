import data from "../../content/data.json";
import site from "../site.config.json";

// Languages = every messages/<lang>.json. One file means a single-language site.
// Messages and data can have any shape; pages and sections read what they need.
const files = import.meta.glob("../../messages/*.json", { eager: true, import: "default" }) as Record<string, any>;
export const messages: Record<string, any> = Object.fromEntries(
  Object.entries(files).map(([path, m]) => [path.match(/([^/]+)\.json$/)![1], m]),
);
export const langs = Object.keys(messages);
export const defaultLang = langs.includes("en") ? "en" : langs[0];
export { data, site };

/** Dotted lookup into a messages object: tr(t, "projects.title"). Falls back to the key itself. */
export const tr = (t: any, key: string): any => key.split(".").reduce((o, k) => (o == null ? o : o[k]), t) ?? key;

/** Internal hrefs ("/", "/projects/") get the language prefix; full URLs stay as they are. */
export const localHref = (lang: string, href: string) => (href.startsWith("/") ? `/${lang}${href}` : href);
export const isExternal = (href: string) => /^https?:\/\//.test(href);

// shortcut: only **bold** and [text](url); swap in a real markdown library if strings need more.
export const md = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
