"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { localePrefixFor } from "@/i18n/constants";
import { createClient } from "@/lib/supabase/server";
import { validateCredentials } from "@/lib/validations/auth";
import { getValidationTranslator } from "@/lib/validations/server-translator";
import { safeRedirectPath } from "@/lib/utils/redirect";
import type { LoginState } from "@/lib/auth/login-state";

function errorState(
  message: string,
  fieldErrors: LoginState["fieldErrors"] = {},
): LoginState {
  return { status: "error", message, fieldErrors };
}

/**
 * Signs the single admin account in with Supabase Auth email/password.
 *
 * Used directly by `useActionState` in the login form. On success it verifies
 * the session with Supabase Auth before redirecting to the admin area.
 */
export async function signIn(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const t = await getValidationTranslator();

  const validation = validateCredentials(
    {
      email: formData.get("email"),
      password: formData.get("password"),
    },
    t,
  );

  if (!validation.ok) {
    return errorState(
      t("actions.correctFields"),
      validation.fields,
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword(
      validation.value,
    );

    if (error || !data.user) {
      return errorState(t("actions.invalidCredentials"));
    }

    // Verify the session is genuinely established before trusting it.
    const { data: verified, error: verifyError } =
      await supabase.auth.getUser();

    if (verifyError || !verified.user) {
      return errorState(t("actions.invalidCredentials"));
    }
  } catch (error) {
    // e.g. missing configuration or a network failure. Never log credentials.
    console.error("Admin sign-in failed:", error);
    return errorState(t("actions.signInUnavailable"));
  }

  // `redirect` throws internally, so it must stay outside the try/catch.
  redirect(safeRedirectPath(formData.get("next")));
}

/** Clears the admin session and returns to the login page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`${localePrefixFor(await getLocale())}/admin/login`);
}
