import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALES } from "./constants";

/**
 * Resolves the active locale and its message catalog for the current request.
 *
 * `requestLocale` is populated by `setRequestLocale` in the root layout during
 * rendering, and falls back to the `X-NEXT-INTL-LOCALE` request header that
 * `src/proxy.ts` sets — which is what lets server actions (that never render a
 * layout) resolve the right locale too.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(LOCALES, requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
