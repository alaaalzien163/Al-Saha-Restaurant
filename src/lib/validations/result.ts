/**
 * Result type shared by all lightweight validators.
 * Keeping a single shape means form actions and env checks can be rendered
 * and reasoned about in the same way without pulling in a validation library.
 */
export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: readonly string[] };

export function valid<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

export function invalid<T = never>(...errors: string[]): ValidationResult<T> {
  return { ok: false, errors };
}

/** Collapse a validation result into a single human-readable message. */
export function firstError(result: ValidationResult<unknown>): string | null {
  return result.ok ? null : (result.errors[0] ?? null);
}
