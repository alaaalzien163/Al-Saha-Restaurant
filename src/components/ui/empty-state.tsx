import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** Decorative icon; hidden from assistive technology. */
  icon?: ReactNode;
  /** Call-to-action slot (e.g. a Button or Link). */
  action?: ReactNode;
  className?: string;
};

/** Neutral "nothing here yet" state. Presentational / Server Component. */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <div aria-hidden className="mb-3 text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-semibold">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-balance">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
