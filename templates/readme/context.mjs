// Derived values for the templates in this folder. Edit freely; the engine doesn't care what it returns.
import { readFileSync, readdirSync } from "node:fs";

// Dotted lookup into messages, same as `tr` in the site: "projects.my-repo".
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

  const contact = data.socialLinks.map((l) => ({ href: l.href, label: l.label ?? l.id }));
  const company = data.companyUrl ? `[${data.company}](${data.companyUrl})` : data.company;
  const quests = (t.quests ?? []).join(" · ");
  const stack = ["Angular", "TypeScript", "JavaScript", "CSS", "Cypress", "Vue", "Laravel", "Docker", "Git", "Node.js"].join(" · "); // README-only: edit here

  return { projects, contact, company, quests, stack, year: new Date().getFullYear() };
};
