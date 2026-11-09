// Derived values for the templates in this folder. Edit freely; the engine doesn't care what it returns.
import { readFileSync, readdirSync } from "node:fs";

// A message by key, like `t` in the site.
const tr = (t, key) => t[key] ?? key;

export default async ({ data, t }) => {
  // Projects: the same files the site's content collection reads (src/content/projects/*.json).
  const dir = "src/content/projects";
  const projects = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")))
    .filter((p) => p.featured_on_landing_page)
    .map((p) => ({ name: p.name, url: p.url, desc: tr(t, p.descriptionTranslationKey) }));

  // Coloured boxes (shields.io badges) for the links under the name and for the tools. README only: edit here.
  // [colour, simple-icons logo slug or "", logo colour]
  const box = (label, [color, logo = "", logoColor = "white"]) =>
    `https://img.shields.io/badge/${encodeURIComponent(label.replace(/-/g, "--").replace(/_/g, "__"))}-${color}?style=for-the-badge` +
    (logo ? `&logo=${logo}&logoColor=${logoColor}` : "");
  const look = {
    website: ["c4ee2c", "", "0a1a00"],
    linkedin: ["0A66C2"], // simple-icons has no LinkedIn logo anymore
    devto: ["3B49DF", "devdotto"],
    github: ["100000", "github"],
  };
  const link = (id, label, href) => ({ href, label, src: box(label, look[id] ?? ["555555"]) });
  const contact = [
    link("website", t.readme_website ?? "Website", data.siteUrl),
    ...data.socialLinks.map((l) => link(l.id, l.label ?? l.id, l.href)),
  ];
  const stack = [
    ["Angular", ["DD0031", "angular"]],
    ["TypeScript", ["3178C6", "typescript"]],
    ["JavaScript", ["F7DF1E", "javascript", "black"]],
    ["Python", ["3776AB", "python"]],
    ["Docker", ["2496ED", "docker"]],
    ["n8n", ["EA4B71", "n8n"]], ["Claude", ["D97757", "claude"]],
  ].map(([name, style]) => ({ name, src: box(name, style) }));
  // HTML link: the heading is an HTML block, where GitHub does not render markdown links.
  const company = data.companyUrl ? `<a href="${data.companyUrl}">${data.company}</a>` : data.company;

  return { projects, contact, company, stack };
};
