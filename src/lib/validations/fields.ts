import type { Translator } from "./translator";

/** Trimmed string, or "" for anything that is not a string. */
export function asTrimmedText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Checkboxes arrive as "on", "true", "1" or a real boolean. */
export function parseCheckboxBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

/**
 * Parses an optional non-negative integer display order.
 *
 * An empty value is treated as `0` so the field can stay optional in the form;
 * anything that is not a whole, non-negative number returns an error message.
 */
export function parseNonNegativeInteger(
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
