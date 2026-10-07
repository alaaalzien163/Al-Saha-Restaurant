"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocationSuffix } from "@/lib/hooks/use-hydrated";
import {
  LOCALES,
  localePrefixFor,
  type AppLocale,
} from "@/i18n/constants";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
};

const LOCALE_SHORT: Record<AppLocale, string> = {
  en: "EN",
  ar: "ع",
};

/**
 * Switches the active locale while staying on the same route.
 *
 * `usePathname()` from `@/i18n/navigation` returns the locale-free path, so
 * switching never has to strip a prefix by hand. The query string and hash come
 * from `useLocationSuffix()` rather than `useSearchParams()`, which keeps the
 * control in the server-rendered HTML instead of forcing a Suspense boundary.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Navigation");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const suffix = useLocationSuffix();

  return (
    <nav
      aria-label={t("languageSwitcher")}
      className={className ?? "flex items-center gap-1"}
    >
      {LOCALES.map((target) => {
        const isActive = target === locale;
        const prefix = localePrefixFor(target);
        const href = `${prefix}${pathname}${suffix}`;

        return (
          <Link
            key={target}
            href={href}
            hrefLang={target}
            lang={target}
            aria-current={isActive ? "true" : undefined}
            aria-label={t("switchTo", { language: LOCALE_LABELS[target] })}
            className={
              isActive
                ? "inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-accent px-2 text-sm font-semibold text-foreground"
                : "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
          >
            <span aria-hidden="true">{LOCALE_SHORT[target]}</span>
            <span className="sr-only">{LOCALE_LABELS[target]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
