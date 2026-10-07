import { resolveTranslator, type Translator } from "./translator";

export type ProfileInput = {
  full_name: unknown;
  phone: unknown;
};

export type ProfileFieldErrors = {
  full_name?: string;
  phone?: string;
};

export type ProfileValues = {
  full_name: string;
  phone: string | null;
};

export type ProfileValidation =
  | { ok: true; value: ProfileValues }
  | { ok: false; fields: ProfileFieldErrors };

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ProfileFieldErrors };

const NAME_MAX = 120;
const PHONE_MAX = 30;
const PHONE_PATTERN = /^[+()\d\s-]+$/;

/** Validates the editable profile fields. `role` is intentionally not editable. */
export function validateProfile(
  input: ProfileInput,
  t?: Translator,
): ProfileValidation {
  const translate = resolveTranslator(t);
  const fields: ProfileFieldErrors = {};

  const fullName =
    typeof input.full_name === "string" ? input.full_name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";

  if (!fullName) {
    fields.full_name = translate("profile.fullNameRequired");
  } else if (fullName.length > NAME_MAX) {
    fields.full_name = translate("profile.fullNameTooLong", { max: NAME_MAX });
  }

  if (phone) {
    if (phone.length > PHONE_MAX) {
      fields.phone = translate("profile.phoneTooLong");
    } else if (!PHONE_PATTERN.test(phone)) {
      fields.phone = translate("profile.phoneInvalid");
    }
  }

  if (fields.full_name || fields.phone) {
    return { ok: false, fields };
  }

  return { ok: true, value: { full_name: fullName, phone: phone || null } };
}

/* ----------------------------------------------------------------- Password */

export type PasswordInput = {
  current_password: unknown;
  new_password: unknown;
  confirm_password: unknown;
};

export type PasswordFieldErrors = {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
};

export type PasswordValues = {
  currentPassword: string;
  newPassword: string;
};

export type PasswordValidation =
  | { ok: true; value: PasswordValues }
  | { ok: false; fields: PasswordFieldErrors };

export type PasswordActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: PasswordFieldErrors };

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Validates a password change. Passwords are only ever sent to Supabase Auth —
 * they are never stored or logged by this application.
 */
export function validatePasswordChange(
  input: PasswordInput,
  t?: Translator,
): PasswordValidation {
  const translate = resolveTranslator(t);
  const fields: PasswordFieldErrors = {};

  const current =
    typeof input.current_password === "string" ? input.current_password : "";
  const next =
    typeof input.new_password === "string" ? input.new_password : "";
  const confirm =
    typeof input.confirm_password === "string" ? input.confirm_password : "";

  if (!current) {
    fields.current_password = translate("password.currentRequired");
  }

  if (!next) {
    fields.new_password = translate("password.newRequired");
  } else if (next.length < MIN_PASSWORD_LENGTH) {
    fields.new_password = translate("password.tooShort", {
      min: MIN_PASSWORD_LENGTH,
    });
  } else if (next === current) {
    fields.new_password = translate("password.sameAsCurrent");
  }

  if (!confirm) {
    fields.confirm_password = translate("password.confirmRequired");
  } else if (confirm !== next) {
    fields.confirm_password = translate("password.mismatch");
  }

  if (fields.current_password || fields.new_password || fields.confirm_password) {
    return { ok: false, fields };
  }

  return { ok: true, value: { currentPassword: current, newPassword: next } };
}
