import data from "../../content/data.json";
import site from "../site.config.json";

// Languages = every messages/<lang>.json. One file means a single-language site.
// Messages can be any shape; pages and components read what they need.
const files = import.meta.glob("../../messages/*.json", { eager: true, import: "default" }) as Record<string, any>;
export const messages: Record<string, any> = Object.fromEntries(
  Object.entries(files).map(([path, m]) => [path.match(/([^/]+)\.json$/)![1], m]),
);
export const langs = Object.keys(messages);
export const defaultLang = langs.includes("en") ? "en" : langs[0];
export { data, site };

/** Dotted lookup into a messages object: tr(t, "projects.my-repo"). Falls back to the key itself. */
export const tr = (t: any, key: string): string =>
  key.split(".").reduce((o, k) => (o == null ? o : o[k]), t) ?? key;

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
