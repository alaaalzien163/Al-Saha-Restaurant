import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/seo";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/ui/empty-state";
import { MenuBrowser } from "@/components/menu";
import { getMenu } from "@/lib/data";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Menu" });

  return pageMetadata({
    lang,
    path: "/menu",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

/**
 * Public menu.
 *
 * Server Component. `getMenu()` fetches once per request and is request-cached;
 * the route is dynamic because the Supabase server client reads cookies, so the
 * menu is always fresh (no stale build-time snapshot). `loading.tsx` provides
 * the streamed fallback.
 *
 * All sections are fetched here and handed to `MenuBrowser`, a single client
 * island that only holds the selected category — so browsing categories never
 * repeats a Supabase query.
 */
export default async function MenuPage({ params }: PageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Menu" });
  const sections = await getMenu();

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <Container className="py-7 sm:py-[var(--section-gap)]">
          <Eyebrow className="text-primary">{t("eyebrow")}</Eyebrow>
          <Heading as="h1" size="xl" className="mt-3 sm:text-4xl">
            {t("title")}
          </Heading>
          <Text
            size="sm"
            tone="muted"
            className="mt-4 max-w-prose text-pretty sm:text-base"
          >
            {t("description")}
          </Text>
        </Container>
      </section>

      {sections.length === 0 ? (
        <Container className="py-[var(--section-gap)]">
          <EmptyState
            title={t("emptyTitle")}
            description={t("emptyDescription")}
          />
        </Container>
      ) : (
        <MenuBrowser sections={sections} />
      )}
    </>
  );
}
