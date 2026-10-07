import type { SiteAddress, SiteContact } from "@/config/site";

/** Builds a dialable `tel:` link, preserving a leading "+". */
export function telHref(number: string): string {
  const cleaned = number.replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

/** Builds a `mailto:` link. */
export function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}

/**
 * Builds a WhatsApp click-to-chat link that works on mobile (opens the app) and
 * desktop (opens WhatsApp Web). The number must be digits only incl. country
 * code — any non-digits are stripped defensively.
 */
export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Whether an href points to another origin. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Address lines to display for a locale, in reading order.
 *
 * Falls back to `address.lines` whenever the locale has no translation, so a
 * partial translation never empties the address. `locale` accepts any locale
 * string ("ar", "en", …) and may be undefined when the caller has none.
 */
export function addressLines(
  address: SiteAddress | undefined,
  locale?: string,
): readonly string[] {
  if (!address) return [];
  const localized = locale ? address.linesByLocale?.[locale] : undefined;
  return localized && localized.length > 0 ? localized : address.lines;
}

/** True when at least one contact detail is configured. */
export function hasAnyContact(contact: SiteContact): boolean {
  return Boolean(
    (contact.address?.lines?.length ?? 0) > 0 ||
      (contact.phoneNumbers?.length ?? 0) > 0 ||
      contact.whatsapp ||
      contact.email ||
      (contact.hours?.length ?? 0) > 0 ||
      (contact.socials?.length ?? 0) > 0,
  );
}
