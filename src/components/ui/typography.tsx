import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ Heading */

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "2xl";

const headingSizes: Record<HeadingSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
  "2xl": "text-4xl",
};

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Semantic level. Keep this aligned with the document outline. */
  as?: HeadingLevel;
  /** Visual size, independent of the semantic level. */
  size?: HeadingSize;
};

export function Heading({
  as: Tag = "h2",
  size = "md",
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        "font-semibold tracking-tight text-balance",
        headingSizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* --------------------------------------------------------------------- Text */

export type TextSize = "xs" | "sm" | "base" | "lg";
export type TextTone = "default" | "muted" | "primary" | "danger" | "success";
export type TextElement = "p" | "span" | "div" | "small" | "strong" | "em";

const textSizes: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const textTones: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  danger: "text-danger",
  success: "text-success",
};

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: TextElement;
  size?: TextSize;
  tone?: TextTone;
};

export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  className,
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textSizes[size], textTones[tone], className)} {...props} />
  );
}

/* -------------------------------------------------------------------- Prose */

/** Wrapper for rendered rich text / CMS-style content. */
export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-prose leading-relaxed text-pretty",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_li]:mt-1 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:ps-5",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ Eyebrow */

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Small uppercase label that sits above a heading. Color is intentionally not
 * baked in — pass `text-primary` on light surfaces or `text-accent` on dark
 * media so contrast stays accessible.
 */
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium tracking-[0.2em] uppercase",
        className,
      )}
      {...props}
    />
  );
}

