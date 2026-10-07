import { redirect } from "next/navigation";
import { cacheLife } from "next/cache";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { localePrefixFor } from "@/i18n/constants";
import { toAdminUser, type AdminUser } from "@/types/auth";

/**
 * Returns the current Supabase user, or null.
 *
 * `getUser()` verifies the session with Supabase Auth rather than trusting the
 * cookie. It runs inside a `'use cache: private'` scope so the layout, page and
 * any nested server component share a single auth round-trip per request, and
 * so the session read stays request- and browser-scoped (never in a server
 * cache shared across users).
 *
 * The scope also keeps Supabase's internal `Date.now()` (session-expiry math)
 * from being treated as prerender-blocking sync IO under Cache Components:
 * private-cache scopes are excluded from the static shell and may read the
 * clock. `stale: Infinity` means "dedupe within the request only" — no
 * cross-request or cross-user caching, so auth is always fresh.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return toAdminUser(user);
}

/**
 * Server-side guard for admin-only routes.
 *
 * This is the authoritative check. The proxy redirect is only an optimization;
 * RLS remains the final authorization layer for every database operation.
 */
export async function requireAdmin(nextPath?: string): Promise<AdminUser> {
  const user = await getAdminUser();

  if (!user) {
    // Stay on the locale the visitor was already using.
    const prefix = localePrefixFor(await getLocale());
    const loginPath = nextPath
      ? `${prefix}/admin/login?next=${encodeURIComponent(nextPath)}`
      : `${prefix}/admin/login`;
    redirect(loginPath);
  }

  return user;
}
