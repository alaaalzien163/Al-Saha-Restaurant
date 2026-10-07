"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useLocationSuffix } from "@/lib/hooks/use-hydrated";
import {
  LOCALES,
  localePrefixFor,
  type AppLocale,
} from "@/i18n/constants";
import {
  DropdownMenu,
  DropdownMenuLink,
} from "@/components/ui/dropdown-menu";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  ar: "العربية",
};

/**
 * A single "Translate" icon that opens a language menu, replacing the previous
 * pair of locale links (which had to shrink to `ع`/`EN` on small screens).
 *
 * `usePathname()` from `@/i18n/navigation` returns the locale-free path, so
 * switching never has to strip a prefix by hand. The query string and hash come
 * from `useLocationSuffix()` rather than `useSearchParams()`, which keeps the
 * control in the server-rendered HTML instead of forcing a Suspense boundary.
 *
 * The options are real anchors: a language switch replaces the whole document
 * anyway, so `lang`/`dir` on `<html>` are correct after the load, and
 * `DropdownMenuLink` closes the menu before navigating.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Navigation");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const suffix = useLocationSuffix();

  return (
    <DropdownMenu
      className={className ?? "flex items-center gap-1"}
      label={t("languageSwitcher")}
      triggerClassName="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      trigger={<TranslateIcon />}
    >
      {LOCALES.map((target) => {
        const isActive = target === locale;
        const prefix = localePrefixFor(target);
        const href = `${prefix}${pathname}${suffix}`;

        return (
          <DropdownMenuLink
            key={target}
            href={href}
            hrefLang={target}
            lang={target}
            aria-current={isActive ? "true" : undefined}
            aria-label={t("switchTo", { language: LOCALE_LABELS[target] })}
            className={isActive ? "bg-accent font-semibold" : undefined}
          >
            {LOCALE_LABELS[target]}
          </DropdownMenuLink>
        );
      })}
    </DropdownMenu>
  );
}

/** "Translate" glyph (Lucide `languages`), sized like the theme toggle icon. */
function TranslateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}
