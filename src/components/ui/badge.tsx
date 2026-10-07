import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "accent"
  | "success"
  | "danger";

export type BadgeSize = "sm" | "md";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const variants: Record<BadgeVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-muted text-foreground",
  outline: "border border-border bg-transparent text-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  danger: "bg-danger text-danger-foreground",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  variant = "secondary",
  size = "sm",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-transparent font-medium whitespace-nowrap",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
