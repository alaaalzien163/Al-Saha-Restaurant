"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import {
  validatePasswordChange,
  validateProfile,
  type PasswordActionResult,
  type ProfileActionResult,
} from "@/lib/validations/profile";
import { getValidationTranslator } from "@/lib/validations/server-translator";
import { saveProfile } from "@/lib/data/profiles";


/** Updates the signed-in admin's own profile. */
export async function updateProfile(
  formData: FormData,
): Promise<ProfileActionResult> {
  const t = await getValidationTranslator();
  const user = await requireAdmin();

  const validation = validateProfile(
    {
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
    },
    t,
  );

  if (!validation.ok) {
    return {
      ok: false,
      message: t("actions.correctFields"),
      fieldErrors: validation.fields,
    };
  }

  try {
    await saveProfile(user.id, validation.value);
  } catch (error) {
    console.error("updateProfile failed:", error);
    return { ok: false, message: t("actions.profileUpdateFailed") };
  }

  revalidatePath("/[lang]/admin/profile", "page");
  return { ok: true };
}

/**
 * Changes the admin's password through Supabase Auth only.
 *
 * The current password is re-verified first, then `auth.updateUser` performs the
 * change. Passwords are never written to `public.profiles` or logged.
 */
export async function changePassword(
  formData: FormData,
): Promise<PasswordActionResult> {
  const t = await getValidationTranslator();
  const user = await requireAdmin();

  const validation = validatePasswordChange(
    {
      current_password: formData.get("current_password"),
      new_password: formData.get("new_password"),
      confirm_password: formData.get("confirm_password"),
    },
    t,
  );

  if (!validation.ok) {
    return {
      ok: false,
      message: t("actions.correctFields"),
      fieldErrors: validation.fields,
    };
  }

  if (!user.email) {
    return { ok: false, message: t("actions.accountNoEmail") };
  }

  try {
    const supabase = await createClient();

    // 1. Verify the current password by re-authenticating.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: validation.value.currentPassword,
    });

    if (verifyError) {
      return {
        ok: false,
        message: t("actions.currentPasswordIncorrect"),
        fieldErrors: { current_password: t("actions.incorrectPassword") },
      };
    }

    // 2. Change the password via Supabase Auth.
    const { error: updateError } = await supabase.auth.updateUser({
      password: validation.value.newPassword,
    });

    if (updateError) {
      console.error("changePassword failed:", updateError);
      return { ok: false, message: t("actions.passwordUpdateFailed") };
    }
  } catch (error) {
    console.error("changePassword error:", error);
    return {
      ok: false,
      message: t("actions.passwordChangeUnavailable"),
    };
  }

  return { ok: true };
}
