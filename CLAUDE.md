# Personal site + profile README template

Usage and concepts for humans are in README.md; don't duplicate them here.

## Layout
| Path | What |
|---|---|
| `content/data.json` | open data shared by site and README (name, role, company, social links, section headings, sections): any key is `data.key` in pages and `{{data.key}}` in README templates; `sections` lists the home page sections |
| `src/site.config.json` | settings only the site uses (`brand`, top bar `menu`, `defaultTheme`) |
| `messages/<lang>.json` | text per language, flat keys (lists = numbered keys `home_quests_1`…), compiled by Paraglide to `src/paraglide/` (generated, git-ignored); SEO text: optional `seo_home_title`, `seo_home_description` (default: home_readme_intro_1-3) |
| `project.inlang/settings.json` | Paraglide project: the language list and `baseLocale`; `astro.config.mjs` reads it for Astro's `i18n` config and the sitemap |
| `src/middleware.ts` | sets Paraglide's locale from `Astro.currentLocale` before each page renders (static build) |
| `src/sections/*.astro` | home page sections, placed from `data.sections`; receive `{ lang, section }` (hero, readme, career, projects, quests, contact, egg + generic text, list, links) |
| `src/scripts/script.ts` | behaviour (theme, menu, typing, scroll motion), reads data-* attributes, no text |
| `data.json` → `sectionHeadings` | terminal-style window headings (`cat README.md`), referenced by key from `data.sections[].heading` and used by the README templates |
| `src/pages/[lang]/` | pages (home renders `data.sections`; projects page) |
| `src/content/projects/`, `src/content.config.ts` | projects as a content collection, one JSON file each; README reads them too |
| `src/content/career/` | career entries (hash, dates, head flag, message keys), one JSON file each; text in `messages` |
| `src/components/`, `src/layouts/`, `src/styles/global.css` | shell, top bar, neutral starter styles; `Base.astro` writes the head with `astro-seo` (`<SEO>`: title, description, canonical, hreflang + `x-default`, Open Graph, Twitter) |
| `public/og/<lang>.png` | share preview per language (1200×630), used when the file exists; `og:locale` comes from the message `seo_og_locale` |
| `src/lib/content.ts` | languages from Paraglide, data; helpers `t` (message by key), `list` (numbered keys), `tr` (dotted lookup in data), `md`, `localHref` |
| `src/pages/index.astro`, `src/pages/404.astro`, `src/pages/robots.txt.ts` | 404: default language, the browser fills in the visited path; root `/`: Paraglide picks the language in the browser (cookie from the switcher, then browser languages, then default) and redirects; robots.txt points at the sitemap |
| `templates/readme/` | README templates (`*.hbs` rendered, other files copied as-is) + optional `context.mjs` for derived/fetched values; `assets/hero.svg.hbs` is the site's whoami window as an animated SVG (HTML in a `foreignObject`, CSS animation only) |
| `scripts/build-readme.mjs` | renders `templates/readme/` to `dist-readme/` with `{ data, t, lang, langs, ...context.mjs }`; language as argument: `npm run build:readme -- <lang>` |
| `.github/workflows/` | FTP deploy to the web hosting (secrets `FTP_*`, variable `FTP_DIR`); README publish to the profile repo |

## Rules
- The generator is content-agnostic: no field names in `scripts/`; structure lives in templates, values in `content/` and `messages/`.
- Personal values live only in `content/`, `messages/`, `src/content/` and `templates/`. Code, scripts and workflows contain no names, repos or domains.
- Never put secrets in the repo or workflows; reference `secrets.*` only (`PROFILE_REPO_TOKEN`).
- Derive repo names from `github.repository_owner` or repo variables, not literals.
- Never hardcode a language list in code; it lives in `project.inlang/settings.json`.
- This is a template other people fill with their own data. In every change, keep the shared parts generic: the engine, scripts and workflows impose no layout, styling, page structure or content shape. Anything visual or structural belongs to the user (sections, pages, templates, content); shipped samples stay neutral placeholders.
- Text shown to visitors always comes from `messages/`, never from components.
- When behavior or usage changes, update README.md (humans) and the layout table here (agents).
