import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import {
  fieldControlBase,
  fieldControlSizes,
  type FieldSize,
} from "./field-styles";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: FieldSize;
};

export function Textarea({
  size = "md",
  rows = 4,
  className,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        fieldControlBase,
        fieldControlSizes[size],
        "resize-y",
        className,
      )}
      {...props}
    />
  );
}
