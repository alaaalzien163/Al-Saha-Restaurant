import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import {
  fieldControlBase,
  fieldControlSizes,
  type FieldSize,
} from "./field-styles";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  size?: FieldSize;
};

export function Input({ size = "md", className, ...props }: InputProps) {
  return (
    <input
      className={cn(fieldControlBase, fieldControlSizes[size], className)}
      {...props}
    />
  );
}
