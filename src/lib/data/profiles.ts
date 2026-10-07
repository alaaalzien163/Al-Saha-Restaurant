import { cacheLife } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

const PROFILE_COLUMNS = "id, full_name, phone, role, created_at, updated_at";

/**
 * The authenticated admin's own profile. RLS restricts reads to the owner.
 *
 * Private-cached: it reads the request cookies and must never land in a shared
 * server cache; the scope also keeps Supabase's internal `Date.now()` out of
 * the prerender-blocking sync IO check.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }

  return data;
}

/**
 * Updates the admin's profile fields (never the password — that lives in
 * Supabase Auth). Falls back to an insert if no row exists yet, subject to RLS.
 */
export async function saveProfile(
  userId: string,
  values: { full_name: string; phone: string | null },
): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) return;

  const { error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId, ...values });

  if (insertError) {
    throw new Error(insertError.message);
  }
}
