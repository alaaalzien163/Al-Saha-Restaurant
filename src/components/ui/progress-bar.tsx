import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ProgressBarProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "role"
> & {
  /** Current value, clamped to [`min`, `max`]. */
  value: number;
  min?: number;
  max?: number;
  /** Accessible name. A progress bar is meaningless without one. */
  label: string;
  /** Classes for the indicator — the only part that carries colour. */
  indicatorClassName?: string;
};

/**
 * Styleless progress bar.
 *
 * Only the structure lives here: a `role="progressbar"` track whose indicator
 * is sized by percentage. Height, colour and radius are the caller's decision
 * — `cn` joins classes without resolving conflicts, so the track deliberately
 * sets no height of its own. That keeps the same primitive usable for a splash
 * intro and an admin upload field. The value is exposed through
 * `aria-valuenow` only — the element is never a live region, so it will not
 * announce every step.
 */
export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label,
  className,
  indicatorClassName,
  ...props
}: ProgressBarProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const percent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cn("w-full overflow-hidden", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn("h-full", indicatorClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
