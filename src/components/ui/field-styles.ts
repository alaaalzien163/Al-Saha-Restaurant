/**
 * Single source of truth for form-control styling.
 *
 * Input, Textarea, and Select all compose these classes so the focus ring,
 * invalid state, and disabled state stay consistent. Focus is handled by the
 * global `:focus-visible` outline in globals.css — components do not add their
 * own ring, which avoids duplicated (and doubled-up) focus indicators.
 */

export type FieldSize = "sm" | "md" | "lg";

export const fieldControlBase =
  "w-full rounded-md border border-input bg-background text-foreground shadow-2xs " +
  "transition-colors placeholder:text-muted-foreground " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "aria-[invalid=true]:border-danger";

export const fieldControlSizes: Record<FieldSize, string> = {
  /* `md` keeps a 44px min target for touch. */
  sm: "min-h-9 px-2.5 py-1.5 text-sm",
  md: "min-h-11 px-3 py-2 text-base",
  lg: "min-h-12 px-4 py-2.5 text-lg",
};
