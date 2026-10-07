import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

/**
 * Server Supabase client.
 *
 * A new client must be created for every request (never cached across
 * requests). It reads the current session from request cookies and writes
 * refreshed cookies when running in a Server Action or Route Handler.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabaseEnv();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `cookieStore.set` throws when called from a Server Component.
          // That is expected: the proxy refreshes sessions for those requests.
        }
      },
    },
  });
}
