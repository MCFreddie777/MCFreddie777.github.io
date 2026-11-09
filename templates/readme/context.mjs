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

  // assets/hero.svg.hbs: numbered messages as a list, and the typed-name steps.
  const list = (prefix) =>
    Object.keys(t)
      .filter((k) => new RegExp(`^${prefix}_\\d+$`).test(k))
      .sort((a, b) => a.split("_").pop() - b.split("_").pop())
      .map((k) => t[k]);

  // Typed name, same steps as the site: the typo version, backspace to the shared start, then the right one.
  const hero = data.sections.find((s) => s.type === "hero") ?? {};
  const wrong = hero.nameTypo ?? data.name, right = data.name;
  let p = 0;
  while (p < wrong.length && p < right.length && wrong[p] === right[p]) p++;
  const steps = [];
  for (let i = 1; i <= wrong.length; i++) steps.push(wrong.slice(0, i));
  for (let i = wrong.length - 1; i >= p; i--) steps.push(wrong.slice(0, i));
  for (let i = p + 1; i <= right.length; i++) steps.push(right.slice(0, i));
  const step = 0.11, total = steps.length * step + 6; // seconds; the full name stays for 6 s before it loops
  const pct = (s) => ((s / total) * 100).toFixed(2);
  const typing = steps.map((text, i) => {
    const on = pct(i * step), off = i === steps.length - 1 ? "100" : pct((i + 1) * step);
    return { text, css: `@keyframes f${i}{0%,${on}%{opacity:0}${on}%,${off}%{opacity:1}${off}%,100%{opacity:${off === "100" ? 1 : 0}}}.f${i}{animation:f${i} ${total.toFixed(1)}s steps(1) infinite}` };
  });

  return { projects, contact, stack, typing, boot: list("home_hero_boot") };
};
