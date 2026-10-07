import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "./env";

/**
 * Browser Supabase client.
 *
 * @supabase/ssr memoizes a single browser instance internally, so calling this
 * from multiple client components is safe and does not create extra auth
 * clients. Import this only from client components.
 */
export function createClient() {
  const { url, publishableKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
