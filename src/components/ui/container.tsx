import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerElement =
  | "div"
  | "section"
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "article"
  | "aside";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ContainerElement;
  /** Constrains the reading width. */
  size?: "narrow" | "default" | "wide";
};

const sizeClasses = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[90rem]",
} as const;

/** Horizontal page container with fluid gutters. */
export function Container({
  as: Tag = "div",
  size = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-[var(--page-gutter)]",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
