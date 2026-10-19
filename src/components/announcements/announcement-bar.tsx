import { getLocale, getTranslations } from "next-intl/server";
import { getActiveAnnouncements } from "@/lib/data/announcements";
import { localizedAnnouncement } from "@/lib/utils/announcements";
import { AnnouncementTicker } from "./announcement-ticker";

/**
 * Public announcement bar.
 *
 * Mounted exactly once, from the public layout, so it appears on every public
 * route (homepage, menu, contact) and — because the admin area sits outside
 * that layout — never on the admin login or dashboard.
 *
 * Renders nothing when there is nothing to show, so an empty table leaves no
 * gap. A failed read is swallowed (`null`) rather than thrown: a decorative
 * strip must never replace a whole page with the error boundary.
 */
export async function AnnouncementBar() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Announcements"),
  ]);

  let announcements;
  try {
    announcements = await getActiveAnnouncements();
  } catch (error) {
    console.error("AnnouncementBar load failed:", error);
    return null;
  }

  const items = announcements
    .map((announcement) => localizedAnnouncement(announcement, locale))
    .filter((item) => item.message.length > 0);

  if (items.length === 0) return null;

  return (
    <AnnouncementTicker
      announcements={items}
      regionLabel={t("regionLabel")}
      opensInNewTab={t("opensInNewTab")}
    />
  );
}
