import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/seo";
import {
  About,
  Hero,
  MenuPreview,
  MenuPreviewSkeleton,
} from "@/components/sections";
import { Contact } from "@/components/contact";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Common" });
  // Official restaurant name for this locale - reused from the existing
  // `Metadata` catalog instead of duplicating (or inventing) the text.
  const tSite = await getTranslations({ locale: lang, namespace: "Metadata" });

  return pageMetadata({
    lang,
    path: "/",
    title: tSite("title"),
    description: t("siteDescription"),
    absoluteTitle: true,
  });
}

/**
 * Public homepage. The Header/Footer come from the public layout; this file
 * only composes the page sections. Everything is server-rendered — the only
 * dynamic part (featured dishes) streams behind a Suspense boundary.
 */
export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Contact" });

  return (
    <>
      <Hero />
      <About />

      <Suspense fallback={<MenuPreviewSkeleton />}>
        <MenuPreview />
      </Suspense>

      <section id="contact" className="border-t border-border">
        <Contact
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </section>
    </>
  );
}
