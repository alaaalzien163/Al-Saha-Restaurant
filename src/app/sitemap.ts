import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/constants";
import { pageAlternates } from "@/i18n/seo";
import { absoluteUrl } from "@/lib/utils/site-url";

/**
 * Public, indexable routes only - derived from the routes that actually exist
 * under `src/app/[lang]`:
 *
 *   (public)/page.tsx         -> `/`
 *   (public)/menu/page.tsx    -> `/menu`
 *   (public)/contact/page.tsx -> `/contact`
 *
 * Every admin route (login, dashboard, categories, items, profile) is private
 * and therefore absent, as is the `[...rest]` catch-all that always 404s.
 */
const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/menu", priority: 0.9, changeFrequency: "daily" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.flatMap(({ path, priority, changeFrequency }) => {
    // The `hreflang` set is identical for every entry of a route.
    const { languages } = pageAlternates(DEFAULT_LOCALE, path);
    const alternates = Object.fromEntries(
      Object.entries(languages).map(([lang, href]) => [
        lang,
        absoluteUrl(href),
      ]),
    );

    // One entry per locale, each cross-referenced with every localized
    // variant of the same page.
    return LOCALES.map((locale) => ({
      url: absoluteUrl(pageAlternates(locale, path).canonical),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: alternates },
    }));
  });
}
