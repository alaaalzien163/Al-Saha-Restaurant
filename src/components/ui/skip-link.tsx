import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type SkipLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Keyboard "skip to content" link (WCAG 2.4.1 Bypass Blocks).
 *
 * Always in the DOM (and the accessibility tree) but translated off-screen
 * until it receives focus, then it slides into view. Using a transform avoids
 * conflicts between the hidden/visible utilities and positioning.
 */
export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "fixed top-3 start-3 z-[60] inline-flex min-h-11 -translate-y-[150%] items-center",
        "rounded-md bg-background px-4 text-sm font-medium text-foreground shadow-lg",
        "transition-transform focus:translate-y-0",
        className,
      )}
    >
      {children}
    </a>
  );
}
