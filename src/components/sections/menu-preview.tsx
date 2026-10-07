import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { MenuItemCard } from "@/components/menu";
import { getMenu } from "@/lib/data";

const FEATURED_LIMIT = 6;

/** Static fallback shown while the featured dishes stream in. */
export function MenuPreviewSkeleton() {
  return (
    <section aria-hidden="true" className="border-t border-border">
      <Container className="py-[var(--section-gap)]">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-8 w-56 max-w-full" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <Skeleton className="aspect-[16/9] w-full rounded-none sm:aspect-[3/2]" />
              <div className="space-y-2 p-2 sm:p-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Featured menu preview for the homepage.
 *
 * Async Server Component: reads the (request-cached) public menu, shows the
 * first few available items, and links to the full menu. Renders nothing when
 * there are no items, so the homepage stays clean on an empty menu.
 */
export async function MenuPreview() {
  const [locale, t, tCommon, sections] = await Promise.all([
    getLocale(),
    getTranslations("Menu"),
    getTranslations("Common"),
    getMenu(),
  ]);
  const featured = sections
    .flatMap((section) => section.items)
    .slice(0, FEATURED_LIMIT);

  if (featured.length === 0) return null;

  return (
    <section className="border-t border-border">
      <Container className="py-[var(--section-gap)]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-prose">
            <Eyebrow className="text-primary">{t("previewEyebrow")}</Eyebrow>
            <Heading as="h2" size="xl" className="mt-3">
              {t("previewTitle")}
            </Heading>
            <Text tone="muted" className="mt-3 text-pretty">
              {t("previewDescription")}
            </Text>
          </div>
          <ButtonLink href="/menu" variant="outline">
            {t("viewFullMenu")}
          </ButtonLink>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {featured.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              locale={locale}
              priceUnavailableLabel={tCommon("priceUnavailable")}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
