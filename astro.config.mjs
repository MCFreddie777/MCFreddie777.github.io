import { defineConfig } from "astro/config";
import icon from "astro-icon";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { readFileSync } from "node:fs";

const { siteUrl } = JSON.parse(readFileSync("./content/data.json", "utf8"));
// Languages live in one place: project.inlang/settings.json (Paraglide's project file).
const { baseLocale, locales } = JSON.parse(readFileSync("./project.inlang/settings.json", "utf8"));

// Custom domain: set it in the repo's Pages settings (an Actions deploy ignores a CNAME file).
export default defineConfig({
  site: siteUrl,
  trailingSlash: "always",
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        // url: the page's own language; cookie: the visitor's last pick; globalVariable: set per page during the
        // build (src/middleware.ts); preferredLanguage: the browser's languages (browser only, used on "/").
        strategy: ["url", "cookie", "globalVariable", "preferredLanguage", "baseLocale"],
        urlPatterns: [
          { pattern: "/:path(.*)?", localized: locales.map((l) => [l, `/${l}/:path(.*)?`]) },
        ],
      }),
    ],
  },
  i18n: {
    locales,
    defaultLocale: baseLocale,
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }, // "/" is src/pages/index.astro
  },
  integrations: [
    icon(),
  ],
});
