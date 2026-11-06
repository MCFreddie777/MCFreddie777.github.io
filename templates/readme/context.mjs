// Derived values for the templates in this folder. Edit freely; the engine doesn't care what it returns.
// Add anything here that is easier to compute in JS than in a template.
import { readFileSync, readdirSync } from "node:fs";

// Dotted lookup into messages, same as `tr` in src/lib/content.ts: "projects.items.sample-one".
const tr = (t, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), t) ?? key;

export default async ({ data, t }) => {
  // Projects: the same files the site's content collection reads (src/content/projects/*.json).
  const dir = "src/content/projects";
  const projects = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")))
    .filter((p) => p.featured_on_landing_page)
    .map((p) => ({ name: p.name, url: p.url, desc: tr(t, p.descriptionTranslationKey) }));

  // Links with their translated labels, same as the site's "links" section.
  const links = (data.socialLinks ?? []).map((l) => ({ href: l.href, label: t.socialLinks?.[l.id] ?? l.id }));

  return { projects, links, year: new Date().getFullYear() };
};
