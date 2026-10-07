import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/** Content available to screen readers but visually hidden. */
export function VisuallyHidden({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("sr-only", className)} {...props} />;
}
