# Personal site + profile README template

Usage and concepts for humans are in README.md; don't duplicate them here.

## Layout
| Path | What |
|---|---|
| `content/data.json` | open data shared by site and README (name, role, company, social links, section headings, sections): any key is `data.key` in pages and `{{data.key}}` in README templates; `sections` lists the home page sections |
| `src/site.config.json` | settings only the site uses (`brand`, top bar `menu`, `defaultTheme`) |
| `messages/<lang>.json` | text per language, any keys; languages = files that exist; SEO text: optional `seo_home_title`, `seo_home_description` (default: intro1-3) |
| `src/sections/*.astro` | home page sections, placed from `data.sections`; receive `{ lang, section }` |
| `src/pages/[lang]/` | pages (home renders `data.sections`; projects page) |
| `src/content/projects/`, `src/content.config.ts` | projects as a content collection, one JSON file each; README reads them too |
| `src/content/career/` | career entries (hash, dates, head flag, translation keys), one JSON file each; text in `messages` |
| `src/components/`, `src/layouts/`, `src/styles/global.css` | shell, top bar, neutral starter styles |
| `src/lib/content.ts` | discovers languages, loads data + messages; helpers `tr`, `md`, `localHref` |
| `templates/readme/` | README templates (`*.hbs` rendered, other files copied as-is) + optional `context.mjs` for derived/fetched values |
| `scripts/build-readme.mjs` | renders `templates/readme/` to `dist-readme/` with `{ data, t, lang, langs, ...context.mjs }`; language as argument: `npm run build:readme -- <lang>` |
| `.github/workflows/` | Pages deploy, README publish to the profile repo |

## Rules
- The generator is content-agnostic: no field names in `scripts/`; structure lives in templates, values in `content/` and `messages/`.
- Personal values live only in `content/`, `messages/`, `src/content/` and `templates/`. Code, scripts and workflows contain no names, repos or domains.
- Never put secrets in the repo or workflows; reference `secrets.*` only (`PROFILE_REPO_TOKEN`).
- Derive repo names from `github.repository_owner` or repo variables, not literals.
- Never hardcode a language list in code.
- This is a template other people fill with their own data. In every change, keep the shared parts generic: the engine, scripts and workflows impose no layout, styling, page structure or content shape. Anything visual or structural belongs to the user (sections, pages, templates, content); shipped samples stay neutral placeholders.
- Text shown to visitors always comes from `messages/`, never from components.
- When behavior or usage changes, update README.md (humans) and the layout table here (agents).
