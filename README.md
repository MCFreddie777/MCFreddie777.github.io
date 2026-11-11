# Personal site + profile README template

Write your content once and get two things:
- a static personal site (Astro) on your own web hosting (uploaded over FTP/FTPS), in as many languages as you like, and
- your GitHub profile README, generated from the same data and pushed to your profile repo by a GitHub Action.

Nothing about layout, sections or content shape is fixed. Put any key in the data, any text in the translations, and show it on the site, in the README, or both.

## Quick start
```bash
npm install
npm run dev                    # site at http://localhost:4321
npm run build:readme           # README in dist-readme/ (English)
npm run build:readme -- sk     # README in another language
```

## Where things live
| What | Where |
|---|---|
| Data that is the same in every language (links, URLs, settings, any key you like) | `content/data.json` |
| All text, one flat file per language (compiled by [Paraglide](https://paraglidejs.com) into `m.key()` functions) | `messages/<lang>.json` |
| The list of languages and the default one | `project.inlang/settings.json` |
| Which sections the home page shows, in order | `content/data.json` → `sections` |
| Settings only the site uses (top bar menu, default theme) | `src/site.config.json` |
| The sections themselves (Astro components) | `src/sections/*.astro` |
| Projects (one file each) | `src/content/projects/*.json` |
| README template and helpers | `templates/readme/` |
| Favicon and home-screen icon, one image for both (linked from `src/layouts/Base.astro`) | `public/icon.png` |
| Share preview image per language (1200×630; leave it out and pages share without one) | `public/og/<lang>.png` |
| Page shell, top bar, colours | `src/layouts/`, `src/components/`, `src/styles/global.css` |
| Sitemap with hreflang alternates (`dist/sitemap-index.xml`, built from `site` = `siteUrl`) and robots.txt | `astro.config.mjs` (`@astrojs/sitemap`), `src/pages/robots.txt.ts` |

### Add a section
1. Create `src/sections/quote.astro`. It receives `{ lang, section }` and can import `data`, `m` (the messages) and `t` from `src/lib/content`.
2. List it in `content/data.json`: `{ "type": "quote", "key": "quote" }` (any extra options you add are in `section`).
3. Add the text to every `messages/<lang>.json`: `"quote_text": "..."`, and show it with `m.quote_text()`. Keys are flat; a list is numbered keys (`quote_1`, `quote_2`, … read with `list("quote")`).

### Add a language
Add `de` to `locales` in `project.inlang/settings.json`, copy `messages/en.json` to `messages/de.json` and translate it. Routes (`/de/`), the language switcher and the README build (`npm run build:readme -- de`) appear on their own. The root `/` is redirected by the server (root `.htaccess` on the hosting, not in this repo): the language the visitor last picked, else their browser's language, else the default. Add the new language there too.

### Add a project
Add `src/content/projects/04-my-project.json` with `name`, `url`, `descriptionTranslationKey` (a message key, e.g. `projects_my_project_description`), and optionally `image` and `featured_on_landing_page`. Put the description under that key in every language file.

### README template
Everything in `templates/readme/` is copied to `dist-readme/`. Files ending in `.hbs` are rendered first (the suffix is dropped). Templates get:

| Variable | Contents |
|---|---|
| `data` | `content/data.json` |
| `t` | `messages/<lang>.json` for the chosen language |
| `lang`, `langs` | chosen language, all languages |
| anything from `context.mjs` | optional `export default async (ctx) => ({ ...extra })` for computed or fetched values |

Handlebars syntax (the `handlebars` package):
```hbs
{{t.name}}                 escaped value        {{{t.intro}}}   raw value (use for Markdown or HTML)
{{t.about_title}}            a message (keys are flat)   {{#each projects}} {{name}} {{@index}} {{/each}}
{{#if posts}} ... {{/if}}
```
A path that resolves to nothing prints nothing. Helpers, partials and `{{else}}` work as in Handlebars.

Images can be templates too: `assets/hero.svg.hbs` becomes `assets/hero.svg`. GitHub shows SVGs through `<img>`, so CSS animation works there, but JS and external files (fonts, images) don't.

## Publish
1. Put the address visitors use in `siteUrl` in `content/data.json`. In this repo's Settings → Secrets and variables → Actions, add the secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` and, if the web folder is not `www/`, the variable `FTP_DIR` (ending with `/`). `.github/workflows/deploy-ftp.yml` builds the site and uploads `dist/`; files on the hosting that are not part of the build (other folders, PHP apps) are never deleted.
2. Create the profile repo `<your-username>/<your-username>` (public).
3. Create a fine-grained token limited to the profile repo with "Contents: read and write". Save it in this repo as the Actions secret `PROFILE_REPO_TOKEN`. Never commit it.
4. Push to `main`: the site deploys, and the README is generated and pushed to the profile repo (also weekly, to refresh fetched data).

The profile repo defaults to `<owner>/<owner>`; set the Actions variable `PROFILE_REPO` to use another. To publish a non-English README, add the language argument to the `build:readme` step in `.github/workflows/readme.yml`.
