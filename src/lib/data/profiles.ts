import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

const PROFILE_COLUMNS = "id, full_name, phone, role, created_at, updated_at";

/** The authenticated admin's own profile. RLS restricts reads to the owner. */
export async function getProfile(userId: string): Promise<Profile | null> {
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
