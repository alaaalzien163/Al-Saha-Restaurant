import { validateSupabaseEnv } from "@/lib/validations/env";
import type { SupabaseEnv } from "@/lib/validations/env";

/**
 * Single source of truth for Supabase connection settings.
 *
 * Only public (NEXT_PUBLIC_) values are read. If the service_role key were
 * ever required for trusted server work, it would be read here from a
 * non-public variable and guarded with `import "server-only"` — it is never
 * used in this application.
 */
export function getSupabaseEnv(): SupabaseEnv {
  const result = validateSupabaseEnv({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.ok) {
    throw new Error(
      [
        "Invalid Supabase environment configuration.",
        ...result.errors.map((error) => `- ${error}`),
        "Copy .env.example to .env.local and fill in the values.",
      ].join("\n"),
    );
  }

  return result.value;
}

/** Non-throwing check, useful for rendering a setup notice instead of crashing. */
export function isSupabaseConfigured(): boolean {
  return validateSupabaseEnv({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).ok;
}
