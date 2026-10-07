import { invalid, valid, type ValidationResult } from "./result";

export type SupabaseEnvInput = {
  url: string | undefined;
  publishableKey: string | undefined;
};

export type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

const URL_PATTERN = /^https?:\/\/[^\s]+$/i;

/**
 * Validates the public Supabase environment variables.
 *
 * Only NEXT_PUBLIC_ values are ever read here. The service_role key is never
 * referenced anywhere in the frontend.
 */
export function validateSupabaseEnv(
  input: SupabaseEnvInput,
): ValidationResult<SupabaseEnv> {
  const url = input.url?.trim() ?? "";
  const publishableKey = input.publishableKey?.trim() ?? "";
  const errors: string[] = [];

  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is not set.");
  } else if (!URL_PATTERN.test(url)) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must be a valid http(s) URL.");
  }

  if (!publishableKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set.");
  }

  if (errors.length > 0) {
    return invalid(...errors);
  }

  return valid({ url, publishableKey });
}
