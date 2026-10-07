import { cn } from "@/lib/utils/cn";

export type SpinnerProps = {
  className?: string;
  /**
   * Accessible label. When omitted, the spinner is treated as decorative
   * (aria-hidden) — use this when a parent already communicates loading state.
   */
  label?: string;
};

const base =
  "inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent";

/** CSS-only loading indicator. No client JavaScript required. */
export function Spinner({ className, label }: SpinnerProps) {
  if (label) {
    return (
      <span role="status" aria-label={label} className={cn(base, className)} />
    );
  }

  return <span aria-hidden="true" className={cn(base, className)} />;
}
