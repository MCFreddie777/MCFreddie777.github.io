// Static build: Paraglide keeps the current language in a global, so set it before each page renders
// (Paraglide's Astro SSG recipe, same as the elevAIton landing page).
import { defineMiddleware } from "astro:middleware";
import { setLocale, type Locale } from "./paraglide/runtime.js";

export const onRequest = defineMiddleware((context, next) => {
  setLocale(context.currentLocale as Locale);
  return next();
});
