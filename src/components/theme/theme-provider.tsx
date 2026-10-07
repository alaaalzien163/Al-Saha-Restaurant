"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const STORAGE_KEY = "al-saha-theme";

/**
 * Light / dark / system theme for the whole app.
 *
 * `next-themes` applies the resolved `class` to `<html>` before hydration
 * (which is why the root layout sets `suppressHydrationWarning`), persists the
 * choice in `localStorage`, and keeps every open tab in sync.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey={STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}
