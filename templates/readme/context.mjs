// Derived values for the templates in this folder. Edit freely; the engine doesn't care what it returns.
import { readFileSync, readdirSync } from "node:fs";

// A message by key, like `t` in the site; lists are numbered keys (quests_1, quests_2, …).
const tr = (t, key) => t[key] ?? key;
const list = (t, key) => Object.keys(t).filter((k) => new RegExp(`^${key}_\\d+$`).test(k)).sort((a, b) => a.split("_").pop() - b.split("_").pop()).map((k) => t[k]);

export default async ({ data, t }) => {
  // Projects: the same files the site's content collection reads (src/content/projects/*.json).
  const dir = "src/content/projects";
  const projects = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")))
    .filter((p) => p.featured_on_landing_page)
    .map((p) => ({ name: p.name, url: p.url, desc: tr(t, p.descriptionTranslationKey) }));

  const contact = data.socialLinks.map((l) => ({ href: l.href, label: l.label ?? l.id }));
  // HTML link: the heading is an HTML block, where GitHub does not render markdown links.
  const company = data.companyUrl ? `<a href="${data.companyUrl}">${data.company}</a>` : data.company;
  // Side quests with an emoji each (README only); the site's trailing "*" footnote marker is dropped here.
  const emoji = { surfing: "🏄", DJing: "🎧", piano: "🎹", "PC games": "🎮", "3D printing": "🖨️", "graphic design": "🎨", surfskate: "🛹", "soldering stuff": "🔧" };
  const quests = list(t, "home_quests")
    .map((q) => q.replace(/\*$/, ""))
    .map((q) => (emoji[q] ? `${emoji[q]} ${q}` : q))
    .join(" · ");
  const stack = ["Angular", "TypeScript", "JavaScript", "CSS", "Cypress", "Vue", "Laravel", "Docker", "Git", "Node.js"].join(" · "); // README-only: edit here

  return { projects, contact, company, quests, stack, year: new Date().getFullYear() };
};
