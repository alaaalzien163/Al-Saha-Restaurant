"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useHydrated } from "@/lib/hooks/use-hydrated";

type Mode = "light" | "dark" | "system";

const NEXT: Record<Mode, Mode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

function normalise(theme: string | undefined): Mode {
  return theme === "light" || theme === "dark" ? theme : "system";
}

function ModeIcon({ mode }: { mode: Mode }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

/**
 * Cycles light -> dark -> system.
 *
 * The first (hydration) render shows the neutral `system` state and
 * `useHydrated()` reveals the stored preference immediately afterwards, so
 * there is no hydration mismatch. The `<html>` element itself never flashes
 * because next-themes applies the resolved class before hydration.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Theme");
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  const mode: Mode = hydrated ? normalise(theme) : "system";
  const label = t(modeLabelKey(mode));
  const nextMode = NEXT[mode];

  return (
    <button
      type="button"
      onClick={() => setTheme(nextMode)}
      aria-label={t("toggle", { current: label, next: t(modeLabelKey(nextMode)) })}
      title={t("toggle", { current: label, next: t(modeLabelKey(nextMode)) })}
      className={
        className ??
        "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      }
    >
      <ModeIcon mode={mode} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function modeLabelKey(mode: Mode) {
  return mode === "light" ? "light" : mode === "dark" ? "dark" : "system";
}
