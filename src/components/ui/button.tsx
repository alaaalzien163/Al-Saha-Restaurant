import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger"
  | "dangerOutline";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

/* Focus is provided by the global `:focus-visible` outline. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium " +
  "transition-colors select-none whitespace-nowrap " +
  "disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-xs hover:opacity-90",
  secondary: "bg-muted text-foreground hover:bg-border",
  outline: "border border-border bg-background text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
  danger: "bg-danger text-danger-foreground shadow-xs hover:opacity-90",
  dangerOutline:
    "border border-danger/40 bg-background text-danger hover:bg-danger/10",
};

/* `md` is 2.75rem tall to keep touch targets usable on mobile. */
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-6 text-lg",
  icon: "size-11",
};

export type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/** Shared class computation so Button and ButtonLink never diverge. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction. */
  isLoading?: boolean;
  /** Rendered before the label. */
  startIcon?: ReactNode;
  /** Rendered after the label. */
  endIcon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  isLoading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner className="size-4" /> : startIcon}
      {children}
      {!isLoading && endIcon ? endIcon : null}
    </button>
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

/** Same visual language as Button, rendered as a Next.js Link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </Link>
  );
}
