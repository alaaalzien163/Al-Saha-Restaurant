/**
 * Currency label appended to a price. Kept here rather than in components so
 * every call site renders Syrian Pounds identically.
 */
const CURRENCY_LABELS: Record<string, string> = {
  en: "SYP",
  ar: "ل.س",
};

const FALLBACK_CURRENCY_LABEL = "SYP";

/**
 * Formats a stored menu price for display (Syrian Pounds).
 *
 * The stored value is never converted — only its presentation changes.
 * `numberingSystem: "latn"` keeps Western digits and grouping for both locales
 * (25,000 / 25,000) so the Arabic and English menus differ only by the label.
 *
 * Returns `null` when no price is defined, so callers can render a translated
 * "price unavailable" message instead of showing $0 or inventing a value.
 */
export function formatPrice(
  price: number | null | undefined,
  locale: string,
): string | null {
  if (price === null || price === undefined || Number.isNaN(price)) return null;

  const label = CURRENCY_LABELS[locale] ?? FALLBACK_CURRENCY_LABEL;
  const amount = new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
  }).format(price);

  return `${amount} ${label}`;
}

/**
 * Formats a stored timestamp for display, using the active locale's date and
 * time conventions.
 *
 * `numberingSystem: "latn"` keeps Western digits in both locales, matching
 * `formatPrice`. Returns `null` for a missing or unparseable value so callers
 * hide the row instead of rendering "Invalid Date".
 */
export function formatDateTime(
  value: string | null | undefined,
  locale: string,
): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
    numberingSystem: "latn",
  }).format(date);
}
