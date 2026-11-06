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
      descriptionTranslationKey: z.string(), // dotted path into messages/<lang>.json, e.g. "projects.items.sample-one"
    }),
});

export const collections = { projects };
