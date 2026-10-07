import { resolveTranslator, type Translator } from "./translator";

export type Credentials = {
  email: string;
  password: string;
};

export type CredentialsInput = {
  email: unknown;
  password: unknown;
};

export type CredentialsFieldErrors = {
  email?: string;
  password?: string;
};

export type CredentialsValidation =
  | { ok: true; value: Credentials }
  | { ok: false; fields: CredentialsFieldErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates admin login credentials and returns per-field messages so the form
 * can point at the exact problem. This is UX validation only — it never
 * replaces Supabase Auth or RLS.
 */
export function validateCredentials(
  input: CredentialsInput,
  t?: Translator,
): CredentialsValidation {
  const translate = resolveTranslator(t);
  const fields: CredentialsFieldErrors = {};

  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!email) {
    fields.email = translate("auth.emailRequired");
  } else if (!EMAIL_PATTERN.test(email)) {
    fields.email = translate("auth.emailInvalid");
  }

  if (!password) {
    fields.password = translate("auth.passwordRequired");
  }

  if (fields.email || fields.password) {
    return { ok: false, fields };
  }

  return { ok: true, value: { email, password } };
}
