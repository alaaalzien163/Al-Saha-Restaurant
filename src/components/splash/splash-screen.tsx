"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useIntroProgress } from "@/lib/hooks/use-intro-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

/** Kept together so the CSS fade and the JS dismissal timer cannot drift. */
const INTRO_DURATION_MS = 1500;
const INTRO_FADE_MS = 400;

/**
 * Whether the intro already played during this browser page load.
 *
 * Module scope on purpose. It survives the re-mounts that happen *within* one
 * page load — switching language rebuilds the `[lang]` layout — but resets on a
 * real page load, which is exactly "once per visit" without `sessionStorage`.
 *
 * It is written from an effect only, so a server render never observes `true`
 * and every server-rendered response still contains the overlay; the initial
 * client render reads the same `false` and hydration stays clean.
 */
let introPlayed = false;

/**
 * First-visit intro overlay.
 *
 * Mounted once, from the public layout, so it covers the homepage, menu and
 * contact pages — and never the admin login or dashboard, which sit outside
 * that layout.
 *
 * This is a short visual introduction, not a measure of page loading: it waits
 * for nothing, reads no Supabase data and requests no resources. The site is
 * fully rendered behind it and becomes interactive the moment the overlay
 * leaves (after ~1.9s, or almost immediately when motion is reduced).
 */
export function SplashScreen() {
  const t = useTranslations("Splash");

  // Read once, at the first render of this mount: `false` on the server and on
  // the first client render, so the markup React hydrates is the markup the
  // server produced.
  const [enabled] = useState(() => !introPlayed);
  const { progress, phase } = useIntroProgress({
    enabled,
    durationMs: INTRO_DURATION_MS,
    fadeMs: INTRO_FADE_MS,
  });

  useEffect(() => {
    introPlayed = true;
  }, []);

  if (phase === "done") return null;

  return (
    <div
      // Above the skip link (z-60) and the sticky header (z-40). Native
      // <dialog> still wins, because it renders in the top layer.
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center",
        "gap-8 bg-background px-[var(--page-gutter)]",
        "transition-opacity ease-out",
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${INTRO_FADE_MS}ms` }}
    >
      <Image
        src={siteConfig.logo.src}
        width={siteConfig.logo.width}
        height={siteConfig.logo.height}
        alt={t("logoAlt")}
        priority
        sizes="(min-width: 640px) 15rem, 10rem"
        // `w-*` + `h-auto` keeps the logo's aspect ratio at every width, and the
        // same `dark:invert` treatment as the navbar keeps it visible on the
        // dark surface.
        className="h-auto w-[min(60vw,10rem)] object-contain sm:w-[min(40vw,15rem)] dark:invert"
      />

      <div className="flex w-[min(78vw,22rem)] flex-col items-center gap-3">
        <ProgressBar
          value={progress}
          label={t("progressLabel")}
          className="h-1.5 rounded-full bg-border"
          indicatorClassName="rounded-full bg-gradient-to-r from-primary to-accent"
        />
        <p className="text-xs font-medium text-muted-foreground">
          {t("loading")}
          {/* Force LTR so "42%" keeps the sign on the correct side in Arabic. */}
          <span dir="ltr" className="ms-2 tabular-nums">
            {progress}%
          </span>
        </p>
      </div>
    </div>
  );
}
