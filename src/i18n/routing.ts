import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "./constants";

/**
 * URL scheme:
 *   en (default) -> `/`, `/menu`, `/admin`   (no prefix)
 *   ar           -> `/ar`, `/ar/menu`, `/ar/admin`
 *
 * Adding a locale is a one-line change in `constants.ts`; every route below
 * (and the language switcher) picks it up automatically.
 */
export const routing = defineRouting({
  locales: [...LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
});

export type { AppLocale };
