import { isSafeAnnouncementUrl } from "@/lib/validations/announcement";
import type { PublicAnnouncement } from "@/types/domain";

/** One announcement resolved for a single locale, ready to render. */
export type LocalizedAnnouncement = {
  id: string;
  message: string;
  /** Safe destination, or `null` when unset/unsafe. */
  linkUrl: string | null;
  linkLabel: string | null;
};

/**
 * Picks the text to display for a locale.
 *
 * Arabic is the source of truth: a blank or missing English message (and link
 * label) falls back to the Arabic one, so the bar can never render empty in
 * English. An unsafe `link_url` is dropped rather than rendered.
 */
export function localizedAnnouncement(
  announcement: PublicAnnouncement,
  locale: string,
): LocalizedAnnouncement {
  const messageEn = announcement.message_en?.trim();
  const labelEn = announcement.link_label_en?.trim();

  const rawLink = announcement.link_url?.trim() ?? "";
  const linkUrl = isSafeAnnouncementUrl(rawLink) ? rawLink : null;

  return {
    id: announcement.id,
    message:
      locale === "en" && messageEn ? messageEn : announcement.message_ar.trim(),
    linkUrl,
    linkLabel: linkUrl
      ? (locale === "en" && labelEn) ||
        announcement.link_label_ar?.trim() ||
        null
      : null,
  };
}

/**
 * Converts a stored timestamp to the `YYYY-MM-DDTHH:mm` shape a
 * `<input type="datetime-local">` expects, in the viewer's local time zone.
 * Returns `""` for a missing or unparseable value so the input stays empty.
 */
export function toLocalDateTimeInputValue(
  value: string | null | undefined,
): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}
