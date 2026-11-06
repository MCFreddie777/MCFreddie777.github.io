// Content-agnostic README generator. Knows no field names.
// Usage: npm run build:readme -- [lang]   (default: en, else first messages/<lang>.json)
//
// Every file under templates/readme/ is copied to dist-readme/ (same relative path).
// Files ending in .hbs are rendered first (suffix dropped) with this context:
//   { data: content/data.json, t: messages/<lang>.json, lang, langs, ...whatever templates/readme/context.mjs returns }
// Optional templates/readme/context.mjs: `export default async (ctx) => ({ ...extra })` for derived values or fetched data.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, statSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import Handlebars from "handlebars";

// {{x}} escapes only & < > " (README text, not a web page); {{{x}}} prints as is.
Handlebars.Utils.escapeExpression = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const src = "templates/readme";
const out = "dist-readme";

const langs = readdirSync("messages").filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
const lang = process.argv[2] ?? (langs.includes("en") ? "en" : langs[0]);
if (!langs.includes(lang)) {
  console.error(`Unknown language "${lang}". Available: ${langs.join(", ")}`);
  process.exit(1);
}

let ctx = {
  data: JSON.parse(readFileSync("content/data.json", "utf8")),
  t: JSON.parse(readFileSync(`messages/${lang}.json`, "utf8")),
  lang,
  langs,
};
const hook = resolve(src, "context.mjs");
if (existsSync(hook)) ctx = { ...ctx, ...(await (await import(pathToFileURL(hook))).default(ctx)) };

rmSync(out, { recursive: true, force: true });
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));

for (const file of walk(src)) {
  const rel = file.slice(src.length + 1);
  if (rel === "context.mjs") continue;
  const target = join(out, rel.replace(/\.hbs$/, ""));
  mkdirSync(dirname(target), { recursive: true });
  if (rel.endsWith(".hbs")) {
    writeFileSync(target, Handlebars.compile(readFileSync(file, "utf8"))(ctx));
  } else copyFileSync(file, target);
}
console.log(`wrote ${out}/ (${lang})`);
