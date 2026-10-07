import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export type ContactMapProps = {
  /** Embeddable map URL (e.g. a Google Maps embed link). */
  embedUrl: string;
  /** Accessible title describing the map. */
  title?: string;
};

/**
 * Lightweight map embed.
 *
 * No map library is loaded — just a native iframe with `loading="lazy"`, so it
 * is fetched only when it scrolls into view. Rendered only when a URL is set.
 */
export async function ContactMap({ embedUrl, title }: ContactMapProps) {
  const t = await getTranslations("Contact");
  const resolvedTitle = title ?? t("mapTitle", { name: siteConfig.name });

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted shadow-sm lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      <iframe
        src={embedUrl}
        title={resolvedTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
