import { resolveTranslator, type Translator } from "./translator";

export type ItemInput = {
  name: unknown;
  description: unknown;
  category_id: unknown;
  price: unknown;
  display_order: unknown;
  is_available: unknown;
};

export type ItemFieldErrors = {
  name?: string;
  description?: string;
  category_id?: string;
  price?: string;
  display_order?: string;
  image?: string;
};

/** Validated values ready to persist. */
export type ItemValues = {
  name: string;
  description: string | null;
  category_id: string;
  price: number;
  display_order: number;
  is_available: boolean;
};

export type ItemValidation =
  | { ok: true; value: ItemValues }
  | { ok: false; fields: ItemFieldErrors };

/** Result returned by the item server actions to the client forms. */
export type ItemActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ItemFieldErrors };

const NAME_MAX = 120;
const DESCRIPTION_MAX = 1000;

function parseBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

function parseNonNegativeInteger(
  value: unknown,
  translate: Translator,
): { value: number; error?: string } {
  const raw =
    typeof value === "number"
      ? String(value)
      : typeof value === "string"
        ? value.trim()
        : "";

  if (raw === "") return { value: 0 };

  const parsed = Number(raw);
  if (!Number.isInteger(parsed)) {
    return { value: 0, error: translate("field.displayOrderNotWhole") };
  }
  if (parsed < 0) {
    return { value: 0, error: translate("field.displayOrderNegative") };
  }
  return { value: parsed };
}

/**
 * Validates an item form. Trims text, requires a name and category, and
 * requires a numeric, non-negative price.
 */
export function validateItem(
  input: ItemInput,
  t?: Translator,
): ItemValidation {
  const translate = resolveTranslator(t);
  const fields: ItemFieldErrors = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const categoryId =
    typeof input.category_id === "string" ? input.category_id.trim() : "";

  if (!name) {
    fields.name = translate("field.nameRequired");
  } else if (name.length > NAME_MAX) {
    fields.name = translate("field.nameTooLong", { max: NAME_MAX });
  }

  if (!categoryId) {
    fields.category_id = translate("item.categoryRequired");
  }

  if (description.length > DESCRIPTION_MAX) {
    fields.description = translate("field.descriptionTooLong", {
      max: DESCRIPTION_MAX,
    });
  }

  const priceRaw =
    typeof input.price === "number"
      ? String(input.price)
      : typeof input.price === "string"
        ? input.price.trim()
        : "";

  let price = 0;
  if (priceRaw === "") {
    fields.price = translate("item.priceRequired");
  } else {
    const parsed = Number(priceRaw);
    if (!Number.isFinite(parsed)) {
      fields.price = translate("item.priceNotNumber");
    } else if (parsed < 0) {
      fields.price = translate("item.priceNegative");
    } else {
      price = Math.round(parsed * 100) / 100;
    }
  }

  const order = parseNonNegativeInteger(input.display_order, translate);
  if (order.error) {
    fields.display_order = order.error;
  }

  if (
    fields.name ||
    fields.description ||
    fields.category_id ||
    fields.price ||
    fields.display_order
  ) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      name,
      description: description ? description : null,
      category_id: categoryId,
      price,
      display_order: order.value,
      is_available: parseBoolean(input.is_available),
    },
  };
}
