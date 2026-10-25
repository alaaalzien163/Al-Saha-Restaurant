import { resolveTranslator, type Translator } from "./translator";
import { isSafeHttpOrPathUrl } from "./url";

export type AnnouncementInput = {
  message_ar: unknown;
  message_en: unknown;
  link_url: unknown;
  link_label_ar: unknown;
  link_label_en: unknown;
  is_active: unknown;
  starts_at: unknown;
  ends_at: unknown;
  display_order: unknown;
};

export type AnnouncementFieldErrors = {
  message_ar?: string;
  message_en?: string;
  link_url?: string;
  link_label_ar?: string;
  link_label_en?: string;
  starts_at?: string;
  ends_at?: string;
  display_order?: string;
};

/** Validated values ready to persist. */
export type AnnouncementValues = {
  message_ar: string;
  message_en: string | null;
  link_url: string | null;
  link_label_ar: string | null;
  link_label_en: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  display_order: number;
};

export type AnnouncementValidation =
  | { ok: true; value: AnnouncementValues }
  | { ok: false; fields: AnnouncementFieldErrors };

/** Result returned by the announcement server actions to the client forms. */
export type AnnouncementActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: AnnouncementFieldErrors };

const MESSAGE_MAX = 500;
const LINK_LABEL_MAX = 60;

function parseBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseNonNegativeInteger(
  value: unknown,
  translate: Translator,
): { value: number; error?: string } {
  const raw =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value.trim()
        : "";

  if (raw === "") return { value: 0 };

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    return { value: 0, error: translate("field.displayOrderNotWhole") };
  }
  if (parsed < 0) {
    return { value: 0, error: translate("field.displayOrderNegative") };
  }
  return { value: parsed };
}

/**
 * Whether a destination is safe to render as a link.
 *
 * Delegates to the shared link/image URL policy so announcements and contact
 * links all accept exactly the same shapes.
 */
export function isSafeAnnouncementUrl(url: string): boolean {
  return isSafeHttpOrPathUrl(url);
}

/**
 * Normalises a scheduling value to UTC ISO 8601.
 *
 * The admin form converts its `datetime-local` inputs to ISO (including the
 * browser's offset) before submitting; a naive local value is still accepted and
 * interpreted in the server's time zone as a fallback.
 */
function parseSchedule(
  value: unknown,
  translate: Translator,
): { value: string | null; error?: string } {
  const raw = asText(value);
  if (raw === "") return { value: null };

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return { value: null, error: translate("announcement.dateInvalid") };
  }

  return { value: parsed.toISOString() };
}

/**
 * Validates an announcement form. Trims all text, requires the Arabic message,
 * rejects unsafe links, a negative or non-integer display order, unparseable
 * dates, and an end time that is not after the start time.
 *
 * This is UX validation — Supabase Auth + RLS remain the authorization
 * boundary, and `is_active` is a flag, never a substitute for `starts_at`/
 * `ends_at`.
 */
export function validateAnnouncement(
  input: AnnouncementInput,
  t?: Translator,
): AnnouncementValidation {
  const translate = resolveTranslator(t);
  const fields: AnnouncementFieldErrors = {};

  const messageAr = asText(input.message_ar);
  const messageEn = asText(input.message_en);
  const linkUrl = asText(input.link_url);
  const linkLabelAr = asText(input.link_label_ar);
  const linkLabelEn = asText(input.link_label_en);

  if (!messageAr) {
    fields.message_ar = translate("announcement.messageRequired");
  } else if (messageAr.length > MESSAGE_MAX) {
    fields.message_ar = translate("announcement.messageTooLong", {
      max: MESSAGE_MAX,
    });
  }

  if (messageEn.length > MESSAGE_MAX) {
    fields.message_en = translate("announcement.messageTooLong", {
      max: MESSAGE_MAX,
    });
  }

  if (linkUrl && !isSafeAnnouncementUrl(linkUrl)) {
    fields.link_url = translate("announcement.linkInvalid");
  }

  if (linkLabelAr.length > LINK_LABEL_MAX) {
    fields.link_label_ar = translate("announcement.linkLabelTooLong", {
      max: LINK_LABEL_MAX,
    });
  }

  if (linkLabelEn.length > LINK_LABEL_MAX) {
    fields.link_label_en = translate("announcement.linkLabelTooLong", {
      max: LINK_LABEL_MAX,
    });
  }

  const order = parseNonNegativeInteger(input.display_order, translate);
  if (order.error) {
    fields.display_order = order.error;
  }

  const starts = parseSchedule(input.starts_at, translate);
  if (starts.error) {
    fields.starts_at = starts.error;
  }

  const ends = parseSchedule(input.ends_at, translate);
  if (ends.error) {
    fields.ends_at = ends.error;
  }

  if (
    !fields.starts_at &&
    !fields.ends_at &&
    starts.value &&
    ends.value &&
    new Date(ends.value).getTime() <= new Date(starts.value).getTime()
  ) {
    fields.ends_at = translate("announcement.endBeforeStart");
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      message_ar: messageAr,
      message_en: messageEn || null,
      link_url: linkUrl || null,
      link_label_ar: linkLabelAr || null,
      link_label_en: linkLabelEn || null,
      is_active: parseBoolean(input.is_active),
      starts_at: starts.value,
      ends_at: ends.value,
      display_order: order.value,
    },
  };
}
