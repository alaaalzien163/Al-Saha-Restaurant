export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[];

/**
 * Minimal className joiner. Avoids a runtime dependency (clsx/classnames)
 * while keeping conditional class composition readable.
 */
export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) classes.push(nested);
    } else {
      classes.push(String(value));
    }
  }

  return classes.join(" ");
}
