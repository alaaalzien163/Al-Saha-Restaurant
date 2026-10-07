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
