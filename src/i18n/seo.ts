import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  localePrefixFor,
  type AppLocale,
} from "./constants";

/**
 * `hreflang` alternates for an application path (no locale prefix).
 *
 *     languageAlternates("/menu") -> { ar: "/menu", en: "/en/menu" }
 *     languageAlternates("/")     -> { ar: "/",     en: "/en" }
 *
 * Returned values are root-relative; Next resolves them against
 * `metadataBase`.
 */
export function languageAlternates(
  path: string,
): Record<AppLocale, string> {
  const alternates = {} as Record<AppLocale, string>;

  for (const locale of LOCALES) {
    const prefix = localePrefixFor(locale);
    if (path === "/") {
      alternates[locale] = prefix || "/";
    } else {
      alternates[locale] = `${prefix}${path}`;
    }
  }

  return alternates;
}

/**
 * `alternates` block for a page: a canonical URL in the current locale plus
 * `hreflang` links for every locale (and `x-default`).
 *
 *     pageAlternates("ar", "/menu") -> { canonical: "/menu", languages: {…} }
 */
export function pageAlternates(lang: string, path: string) {
  const current = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const languages = languageAlternates(path);
  return {
    canonical: languages[current],
    languages: { ...languages, "x-default": languages[DEFAULT_HREFLANG] },
  };
}

/** `og:locale` codes for the supported locales. */
export const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  ar: "ar_AR",
};

/** Default language used in `<link rel="alternate" hreflang="x-default">`. */
export const DEFAULT_HREFLANG = DEFAULT_LOCALE;
