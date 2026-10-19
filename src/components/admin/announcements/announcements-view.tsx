import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils/format";
import type { Announcement } from "@/types/domain";
import { AnnouncementRowActions } from "./announcement-row-actions";

export type AnnouncementsViewProps = {
  announcements: Announcement[];
};

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <Badge variant={active ? "success" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

/**
 * Responsive announcements view: a data table on desktop and stacked cards on
 * small screens, mirroring the categories/items admin views.
 */
export async function AnnouncementsView({
  announcements,
}: AnnouncementsViewProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Admin")]);
  const activeLabel = t("status.active");
  const inactiveLabel = t("status.inactive");

  /** Human-readable summary of an announcement's schedule window. */
  function scheduleLabel(announcement: Announcement): string {
    const from = formatDateTime(announcement.starts_at, locale);
    const until = formatDateTime(announcement.ends_at, locale);

    if (from && until) return t("announcements.scheduleRange", { from, until });
    if (from) return t("announcements.scheduleFrom", { from });
    if (until) return t("announcements.scheduleUntil", { until });
    return t("announcements.scheduleAlways");
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-sm lg:block">
        <table className="w-full text-start text-sm">
          <caption className="sr-only">{t("announcements.caption")}</caption>
          <thead className="border-b border-border bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.order")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.message")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.schedule")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.status")}
              </th>
              <th scope="col" className="px-4 py-3 text-end font-medium">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr
                key={announcement.id}
                className="border-b border-border last:border-0 align-top"
              >
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {announcement.display_order}
                </td>
                <th
                  scope="row"
                  className="max-w-md px-4 py-3 font-medium text-foreground"
                >
                  <span className="block text-pretty">
                    {announcement.message_ar}
                  </span>
                  {announcement.message_en ? (
                    <span
                      dir="ltr"
                      className="mt-0.5 block text-xs font-normal text-muted-foreground"
                    >
                      {announcement.message_en}
                    </span>
                  ) : null}
                  {announcement.link_url ? (
                    <span
                      dir="ltr"
                      className="mt-1 block truncate text-xs font-normal text-muted-foreground"
                    >
                      {announcement.link_url}
                    </span>
                  ) : null}
                </th>
                <td className="px-4 py-3 text-muted-foreground">
                  {scheduleLabel(announcement)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    active={announcement.is_active}
                    activeLabel={activeLabel}
                    inactiveLabel={inactiveLabel}
                  />
                </td>
                <td className="px-4 py-3">
                  <AnnouncementRowActions announcement={announcement} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 lg:hidden">
        {announcements.map((announcement) => (
          <li
            key={announcement.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-medium text-pretty text-foreground">
                  {announcement.message_ar}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("announcements.displayOrder", {
                    order: announcement.display_order,
                  })}
                </p>
              </div>
              <StatusBadge
                active={announcement.is_active}
                activeLabel={activeLabel}
                inactiveLabel={inactiveLabel}
              />
            </div>

            {announcement.message_en ? (
              <p
                dir="ltr"
                className="mt-2 text-sm text-pretty text-muted-foreground"
              >
                {announcement.message_en}
              </p>
            ) : null}

            <p className="mt-2 text-xs text-muted-foreground">
              {scheduleLabel(announcement)}
            </p>

            <div className="mt-3 border-t border-border pt-3">
              <AnnouncementRowActions announcement={announcement} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
