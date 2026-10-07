import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ContactChannelProps = {
  /** Decorative icon (rendered aria-hidden by the icon components). */
  icon: ReactNode;
  /** Visible label — meaning must not rely on the icon alone. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** A single contact detail block: icon + visible label + value. */
export function ContactChannel({
  icon,
  label,
  children,
  className,
}: ContactChannelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-foreground">
          {icon}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-3 text-foreground">{children}</div>
    </div>
  );
}
