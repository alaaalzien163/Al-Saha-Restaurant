import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { siteConfig } from "@/config/site";
import { directionFor } from "@/i18n/constants";
import { routing } from "@/i18n/routing";
import { OPEN_GRAPH_LOCALES } from "@/i18n/seo";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Resolved once at build time and handed to `NextIntlClientProvider` so it
 * never has to call `getConfig()` (which reads `headers()` and would block
 * static prerendering of every `/[lang]/*` route).
 */
const PLATFORM_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const PLATFORM_FORMATS = {};
const BUILD_TIME = new Date();

/** One static route per locale: `/`, `/menu`, `/ar`, `/ar/menu`, … */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = hasLocale(routing.locales, lang) ? lang : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    applicationName: siteConfig.name,
    openGraph: {
      siteName: siteConfig.name,
      locale: OPEN_GRAPH_LOCALES[locale],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#2b2622" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  // Enables static rendering for this locale's routes.
  setRequestLocale(lang);

  // Passed explicitly so the provider never has to fall back to reading the
  // request, which would make every route dynamic.
  const messages = await getMessages({ locale: lang });

  return (
    <html
      lang={lang}
      dir={directionFor(lang)}
      data-scroll-behavior="smooth"
      className="h-full"
      // next-themes writes `class`/`style` before hydration on purpose.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {/*
            Every prop is passed explicitly on purpose: the server wrapper of
            `NextIntlClientProvider` resolves missing `formats`/`now`/`timeZone`
            through `getConfig()`, which reads the request locale and therefore
            `headers()` — that would block static prerendering of `/[lang]/*`.
          */}
          <NextIntlClientProvider
            locale={lang}
            messages={messages}
            formats={PLATFORM_FORMATS}
            timeZone={PLATFORM_TIME_ZONE}
            now={BUILD_TIME}
          >
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
