import type { User } from "@supabase/supabase-js";

/**
 * The application treats Supabase Auth as the source of truth for identity.
 * Only non-sensitive fields are exposed to the UI.
 */
export type AdminUser = {
  id: string;
  email: string | null;
};

export function toAdminUser(user: User): AdminUser {
  return { id: user.id, email: user.email ?? null };
}
