import { cn } from "@/lib/utils/cn";

/**
 * Shared navigation styling so the desktop (server) and mobile (client)
 * navigations never duplicate class logic.
 */

export { isActivePath } from "@/lib/utils/nav";

/** Desktop navigation link (hover/focus emphasis). */
export const desktopNavLinkClass =
  "inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium " +
  "text-muted-foreground transition-colors hover:text-foreground";

/** Mobile navigation link (larger target, active surface). */
export function mobileNavLinkClass(active: boolean): string {
  return cn(
    "flex min-h-12 items-center rounded-md px-3 text-base font-medium transition-colors",
    active
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}
