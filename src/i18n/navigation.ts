import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for the `next/link` and `next/navigation` APIs.
 *
 * `usePathname()` returns the pathname **without** the locale prefix, and
 * `router.replace(pathname, { locale })` adds it back — so call sites never
 * have to concatenate prefixes by hand.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
