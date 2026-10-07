"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Label } from "./label";

export type FieldRenderProps = {
  /** Wire this onto the control's `id`. */
  id: string;
  /** Wire this onto the control's `aria-describedby` (may be undefined). */
  describedBy: string | undefined;
  /** Wire this onto the control's `aria-invalid`. */
  invalid: boolean;
};

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Required for label/description/error associations. */
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  /** Render prop receiving the accessibility wiring for the control. */
  children: (props: FieldRenderProps) => ReactNode;
};

/**
 * Accessible form field wrapper. It owns the label, description, and error
 * messaging, and hands the consumer the ids/aria attributes to spread onto the
 * control. A client component so the required-hint can be localized.
 */
export function Field({
  id,
  label,
  description,
  error,
  required = false,
  className,
  children,
  ...props
}: FieldProps) {
  const t = useTranslations("Common");
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <>
            <span aria-hidden className="ms-0.5 text-danger">
              *
            </span>
            <span className="sr-only"> {t("required")}</span>
          </>
        ) : null}
      </Label>

      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
