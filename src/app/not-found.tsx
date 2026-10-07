import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { directionFor } from "@/i18n/constants";
import { routing } from "@/i18n/routing";
import "./globals.css";

/**
 * Global 404.
 *
 * `app/[lang]/[...rest]/page.tsx` is deliberately absent: an unmatched URL has
 * no route, so Next resolves it here instead of inside the `[lang]` loading
 * Suspense (which would stream the fallback first and force `notFound()` to be
 * replayed on the client - users only ever saw a spinner).
 *
 * Everything locale-dependent is read per request behind `<Suspense>`, so the
 * route still produces a prerendered shell; `instant = false` tells Cache
 * Components this segment is allowed to block on that read.
 */
export async function generateMetadata(): Promise<Metadata> {
  const raw = await getLocale();
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Errors" });

  return { title: t("notFoundTitle") };
}

export const instant = false;

async function LocalizedCopy() {
  const raw = await getLocale();
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Errors" });

  return (
    <div lang={locale} dir={directionFor(locale)}>
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">{t("notFoundTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("notFoundBody")}</p>
      <a
        href={locale === routing.defaultLocale ? "/" : `/${locale}`}
        className="mt-6 inline-flex min-h-11 items-center rounded-md px-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("backToHome")}
      </a>
    </div>
  );
}

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <Suspense fallback={null}>
        <LocalizedCopy />
      </Suspense>
    </main>
  );
}
