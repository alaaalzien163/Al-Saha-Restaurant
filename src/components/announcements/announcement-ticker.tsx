import { isExternalHref } from "@/lib/utils/contact";
import { cn } from "@/lib/utils/cn";
import type { LocalizedAnnouncement } from "@/lib/utils/announcements";
import { Link } from "@/i18n/navigation";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

export type AnnouncementTickerProps = {
  announcements: LocalizedAnnouncement[];
  /** Accessible name for the region, e.g. "Announcements". */
  regionLabel: string;
  /** Suffix announced after external links, e.g. "(opens in a new tab)". */
  opensInNewTab: string;
};

/*
 * The track holds two identical copies of the list and translates by exactly
 * one copy width, so the end of the loop is identical to the start.
 *
 * - `hover`/`focus-within` pause the motion so it can be read or followed.
 * - `rtl:` reverses the direction so it scrolls with the reading direction.
 * - `motion-reduce:` drops the animation entirely, keeps one static copy and
 *   lets the items wrap, so nothing moves and nothing is clipped.
 *
 * The strip carries no surface of its own: it sits on the page background, so
 * text uses `text-foreground` (readable in both themes) and the separator keeps
 * a palette accent — red on the light background, gold on the dark one, which
 * is the rule `Eyebrow` documents for accent text.
 */
const trackClasses =
  "flex w-max items-center will-change-transform " +
  "animate-[announcement-marquee_40s_linear_infinite] " +
  "group-hover:[animation-play-state:paused] " +
  "group-focus-within:[animation-play-state:paused] " +
  "rtl:[animation-direction:reverse] " +
  "motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap";

function AnnouncementLink({
  announcement,
  opensInNewTab,
}: {
  announcement: LocalizedAnnouncement;
  opensInNewTab: string;
}) {
  const { message, linkUrl, linkLabel } = announcement;
  const label = linkLabel ? `${message} — ${linkLabel}` : message;

  if (!linkUrl) {
    return <span className="py-1">{message}</span>;
  }

  const className =
    "py-1 font-medium underline decoration-current/40 underline-offset-4 " +
    "transition-colors hover:decoration-current";

  if (isExternalHref(linkUrl)) {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <VisuallyHidden> {opensInNewTab}</VisuallyHidden>
      </a>
    );
  }

  return (
    <Link href={linkUrl} className={className}>
      {label}
    </Link>
  );
}

function AnnouncementSequence({
  announcements,
  opensInNewTab,
  className,
  ariaHidden,
}: {
  announcements: LocalizedAnnouncement[];
  opensInNewTab: string;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "flex shrink-0 items-center motion-reduce:flex-wrap",
        className,
      )}
    >
      {announcements.map((announcement) => (
        <li
          key={announcement.id}
          className="flex items-center whitespace-nowrap"
        >
          <span aria-hidden className="mx-3 text-primary dark:text-accent">
            &bull;
          </span>
          <AnnouncementLink
            announcement={announcement}
            opensInNewTab={opensInNewTab}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The visual announcement bar: a full-bleed strip that scrolls its messages
 * horizontally. Presentational and side-effect free — the caller supplies the
 * already-localized messages.
 *
 * The background is deliberately transparent (`bg-transparent`, no blur, no
 * opacity, no card): the bar blends into the page and header surface, and only
 * a hairline border separates it from the sticky header below.
 */
export function AnnouncementTicker({
  announcements,
  regionLabel,
  opensInNewTab,
}: AnnouncementTickerProps) {
  return (
    <section
      aria-label={regionLabel}
      className="group border-b border-border bg-transparent text-foreground"
    >
      <div className="overflow-hidden py-2 text-sm motion-reduce:overflow-visible">
        <div className={trackClasses}>
          <AnnouncementSequence
            announcements={announcements}
            opensInNewTab={opensInNewTab}
          />
          <AnnouncementSequence
            announcements={announcements}
            opensInNewTab={opensInNewTab}
            ariaHidden
            className="motion-reduce:hidden"
          />
        </div>
      </div>
    </section>
  );
}
