// Projects are a content collection: one JSON file per project in src/content/projects/ (sorted by file name).
// The README generator reads the same files. Add fields freely; extend the schema to validate them.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string().url(),
      image: image().optional(), // path relative to the file, e.g. "../../assets/my-project.png"
      featured_on_landing_page: z.boolean().optional(),
      descriptionTranslationKey: z.string(), // message key in messages/<lang>.json, e.g. "projects_sample_one_description"
    }),
});

// Career entries: one JSON file each in src/content/career/ (numbered oldest first; the page lists them newest first).
// Dates are "YYYY-MM"; no "to" means "now". Text lives in messages, referenced by translation key.
const career = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/career" }),
  schema: z.object({
    hash: z.string(),
    from: z.string(),
    to: z.string().optional(),
    head: z.boolean().optional(),
    titleTranslationKey: z.string(),
    descriptionTranslationKey: z.string(),
  }),
});

export const collections = { projects, career };
