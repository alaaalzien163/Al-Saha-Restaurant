/**
 * Locale primitives with zero dependencies.
 *
 * Kept separate from `routing.ts` so `src/proxy.ts` can read the locale list
 * without pulling `next-intl` into the proxy bundle.
 */
export const LOCALES = ["en", "ar"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

/** Locales that read right-to-left. Extend when adding an RTL language. */
const RTL_LOCALES: readonly string[] = ["ar"];

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function directionFor(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}

/**
 * The URL prefix a locale deserves, given `localePrefix: "as-needed"`.
 * The default locale is served from the root, so it gets no prefix.
 */
export function localePrefixFor(locale: string): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Splits a pathname into its locale prefix and the application route.
 * `/ar/menu` -> `{ locale: "ar", routePath: "/menu" }`
 * `/menu`    -> `{ locale: null,  routePath: "/menu" }`
 */
export function splitLocale(pathname: string): {
  locale: AppLocale | null;
  routePath: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const head = segments[0];

  if (head !== undefined && isLocale(head)) {
    const rest = segments.slice(1).join("/");
    return { locale: head, routePath: rest ? `/${rest}` : "/" };
  }

  return { locale: null, routePath: pathname };
}
