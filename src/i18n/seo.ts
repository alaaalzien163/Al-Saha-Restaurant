import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils/site-url";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  localePrefixFor,
  type AppLocale,
} from "./constants";

/**
 * `hreflang` alternates for an application path (no locale prefix).
 *
 *     languageAlternates("/menu") -> { ar: "/menu", en: "/en/menu" }
 *     languageAlternates("/")     -> { ar: "/",     en: "/en" }
 *
 * Returned values are root-relative; Next resolves them against
 * `metadataBase`.
 */
export function languageAlternates(
  path: string,
): Record<AppLocale, string> {
  const alternates = {} as Record<AppLocale, string>;

  for (const locale of LOCALES) {
    const prefix = localePrefixFor(locale);
    if (path === "/") {
      alternates[locale] = prefix || "/";
    } else {
      alternates[locale] = `${prefix}${path}`;
    }
  }

  return alternates;
}

/**
 * `alternates` block for a page: a canonical URL in the current locale plus
 * `hreflang` links for every locale (and `x-default`).
 *
 *     pageAlternates("ar", "/menu") -> { canonical: "/menu", languages: {…} }
 */
export function pageAlternates(lang: string, path: string) {
  const current = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const languages = languageAlternates(path);
  return {
    canonical: languages[current],
    languages: { ...languages, "x-default": languages[DEFAULT_HREFLANG] },
  };
}

/** `og:locale` codes for the supported locales. */
export const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
  en: "en_US",
  ar: "ar_AR",
};

/** Default language used in `<link rel="alternate" hreflang="x-default">`. */
export const DEFAULT_HREFLANG = DEFAULT_LOCALE;

/**
 * The single social-share image for every public page: the restaurant logo,
 * the same asset the Header uses. An existing local asset - no external image
 * host is ever introduced. `width`/`height` are the file's real pixel
 * dimensions (570x438) - never guessed.
 */
export const SOCIAL_PREVIEW_IMAGE = {
  path: "/images/logo-removebg-preview(1).png",
  width: 570,
  height: 438,
  alt: siteConfig.name,
} as const;

type PageMetadataInput = {
  /** Current route locale (`ar` / `en`). */
  lang: string;
  /** App-relative path without a locale prefix (`"/"`, `"/menu"`, …). */
  path: string;
  /** Plain-text page title; also used as `og:title` and `twitter:title`. */
  title: string;
  description: string;
  /**
   * Emit the title as-is instead of through the layout's `%s | <site>`
   * template. Used by the homepage, whose title *is* the site name.
   */
  absoluteTitle?: boolean;
};

/**
 * Complete metadata for one public indexable page.
 *
 * Keeps `title`, `description`, `canonical`, `hreflang`, `openGraph` and
 * `twitter` in sync - every absolute URL is resolved from `NEXT_PUBLIC_SITE_URL`
 * via `absoluteUrl`, so localhost can never leak into production metadata.
 * Private pages (admin) must not use this helper.
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const { canonical, languages } = pageAlternates(lang, path);
  const url = absoluteUrl(canonical);
  const image = absoluteUrl(SOCIAL_PREVIEW_IMAGE.path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale: OPEN_GRAPH_LOCALES[locale],
      images: [
        {
          url: image,
          width: SOCIAL_PREVIEW_IMAGE.width,
          height: SOCIAL_PREVIEW_IMAGE.height,
          alt: SOCIAL_PREVIEW_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

