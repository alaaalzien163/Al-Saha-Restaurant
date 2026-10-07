import { cache } from "react";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { localePrefixFor } from "@/i18n/constants";
import { toAdminUser, type AdminUser } from "@/types/auth";

/**
 * Returns the current Supabase user, or null.
 *
 * `getUser()` verifies the session with Supabase Auth rather than trusting the
 * cookie. Wrapped in `cache` so that the layout, page, and any nested server
 * component share a single auth round-trip per request.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return toAdminUser(user);
});

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
