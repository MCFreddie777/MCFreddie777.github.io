import { defineConfig } from "astro/config";
import { readFileSync, readdirSync } from "node:fs";

const { siteUrl } = JSON.parse(readFileSync("./content/data.json", "utf8"));
const langs = readdirSync("./messages").filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
const defaultLang = langs.includes("en") ? "en" : langs[0];

// Custom domain: set it in the repo's Pages settings (an Actions deploy ignores a CNAME file).
export default defineConfig({
  site: siteUrl,
  trailingSlash: "always",
  redirects: { "/": `/${defaultLang}/` },
});
