import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

export type SessionRefresh = {
  /** Response that carries any refreshed auth cookies. */
  response: NextResponse;
  /** The authenticated user, or null. */
  user: User | null;
};

/**
 * Refreshes the Supabase session for a request and reports the current user.
 *
 * Must run before any response is committed so refreshed cookies are not lost.
 * `getUser()` is used (rather than `getSession()`) because it verifies the
 * token with Supabase Auth instead of trusting the cookie contents.
 */
export async function refreshSession(
  request: NextRequest,
): Promise<SessionRefresh> {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
