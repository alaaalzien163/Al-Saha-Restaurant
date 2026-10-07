import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { pageAlternates } from "@/i18n/seo";
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

  return {
    title: { absolute: siteConfig.name },
    description: t("siteDescription"),
    alternates: pageAlternates(lang, "/"),
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: t("siteDescription"),
      url: "/",
      locale: siteConfig.locale,
      images: [
        {
          url: "/images/hero/hero-desktop.jpg",
          width: 1920,
          height: 1080,
          alt: siteConfig.name,
        },
      ],
    },
  };
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
