// Derived values for the templates in this folder. Edit freely; the engine doesn't care what it returns.

export default async ({ data, t }) => {
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

  // Latest dev.to posts (the section hides itself while there are none). Refreshed by the weekly workflow run.
  const devto = data.socialLinks.find((l) => l.id === "devto");
  let posts = [];
  if (devto) {
    try {
      const res = await fetch(`https://dev.to/api/articles?per_page=5&username=${devto.href.split("/").filter(Boolean).pop()}`);
      if (res.ok) posts = (await res.json()).map((a) => ({ title: a.title, url: a.url, date: a.readable_publish_date }));
    } catch {} // offline or dev.to down: build the README without posts
  }

  return { posts, contact, stack, typing, boot: list("home_hero_boot") };
};
