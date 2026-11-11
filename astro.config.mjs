import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { readFileSync } from "node:fs";

const { siteUrl } = JSON.parse(readFileSync("./content/data.json", "utf8"));
// Languages live in one place: project.inlang/settings.json (Paraglide's project file).
const { baseLocale, locales } = JSON.parse(readFileSync("./project.inlang/settings.json", "utf8"));

// siteUrl is the address visitors use: canonical links, hreflang, sitemap and share previews are built from it.
export default defineConfig({
  site: siteUrl,
  trailingSlash: "always",
  vite: {
    plugins: [
      paraglideVitePlugin({
        project: "./project.inlang",
        outdir: "./src/paraglide",
        // url: the page's own language; cookie: the visitor's last pick (read by the server's .htaccess on "/");
        // globalVariable: set per page during the build (src/middleware.ts).
        strategy: ["url", "cookie", "globalVariable", "baseLocale"],
        urlPatterns: [
          { pattern: "/:path(.*)?", localized: locales.map((l) => [l, `/${l}/:path(.*)?`]) },
        ],
      }),
    ],
  },
  i18n: {
    locales,
    defaultLocale: baseLocale,
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
  },
  integrations: [
    icon(),
    sitemap({
      filter: (page) => new URL(page).pathname !== "/",
      i18n: { defaultLocale: baseLocale, locales: Object.fromEntries(locales.map((l) => [l, l])) },
    }),
  ],
});
