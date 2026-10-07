import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import {
  fieldControlBase,
  fieldControlSizes,
  type FieldSize,
} from "./field-styles";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  size?: FieldSize;
};

/**
 * Native <select> — keyboard- and screen-reader-friendly by default, with no
 * client JavaScript. Compose options as children.
 */
export function Select({ size = "md", className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        fieldControlBase,
        fieldControlSizes[size],
        "cursor-pointer pe-8",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
