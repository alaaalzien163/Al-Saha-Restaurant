import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageAlternates } from "@/i18n/seo";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { Contact } from "@/components/contact";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Contact" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: pageAlternates(lang, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Contact" });

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <Container className="py-[var(--section-gap)]">
          <Eyebrow className="text-primary">{t("eyebrow")}</Eyebrow>
          <Heading as="h1" size="2xl" className="mt-3">
            {t("title")}
          </Heading>
          <Text tone="muted" className="mt-4 max-w-prose text-pretty">
            {t("description")}
          </Text>
        </Container>
      </section>

      <Contact />
    </>
  );
}
