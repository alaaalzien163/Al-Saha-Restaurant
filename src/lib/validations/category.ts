import { resolveTranslator, type Translator } from "./translator";

export type CategoryInput = {
  name: unknown;
  description: unknown;
  display_order: unknown;
  is_active: unknown;
};

export type CategoryFieldErrors = {
  name?: string;
  description?: string;
  display_order?: string;
};

/** Validated values ready to persist. */
export type CategoryValues = {
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type CategoryValidation =
  | { ok: true; value: CategoryValues }
  | { ok: false; fields: CategoryFieldErrors };

const NAME_MAX = 120;
const DESCRIPTION_MAX = 500;

function parseBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

/**
 * Validates a category form. Trims all text and rejects a negative or
 * non-integer display order. This is UX validation — Supabase Auth + RLS
 * remain the authorization boundary.
 */
export function validateCategory(
  input: CategoryInput,
  t?: Translator,
): CategoryValidation {
  const translate = resolveTranslator(t);
  const fields: CategoryFieldErrors = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";

  if (!name) {
    fields.name = translate("field.nameRequired");
  } else if (name.length > NAME_MAX) {
    fields.name = translate("field.nameTooLong", { max: NAME_MAX });
  }

  if (description.length > DESCRIPTION_MAX) {
    fields.description = translate("field.descriptionTooLong", {
      max: DESCRIPTION_MAX,
    });
  }

  const rawOrder =
    typeof input.display_order === "number"
      ? String(input.display_order)
      : typeof input.display_order === "string"
        ? input.display_order.trim()
        : "";

  let displayOrder = 0;
  if (rawOrder !== "") {
    const parsed = Number(rawOrder);
    if (!Number.isInteger(parsed)) {
      fields.display_order = translate("field.displayOrderNotWhole");
    } else if (parsed < 0) {
      fields.display_order = translate("field.displayOrderNegative");
    } else {
      displayOrder = parsed;
    }
  }

  if (fields.name || fields.description || fields.display_order) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      name,
      description: description ? description : null,
      display_order: displayOrder,
      is_active: parseBoolean(input.is_active),
    },
  };
}

/** Result returned by the category server actions to the client forms. */
export type CategoryActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: CategoryFieldErrors };
