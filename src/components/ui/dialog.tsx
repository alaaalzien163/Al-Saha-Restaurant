"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { VisuallyHidden } from "./visually-hidden";

export type DialogSize = "sm" | "md" | "lg";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Footer actions, rendered in a right-aligned row. */
  footer?: ReactNode;
  size?: DialogSize;
  className?: string;
  hideCloseButton?: boolean;
};

const dialogSizes: Record<DialogSize, string> = {
  sm: "w-[min(92vw,24rem)]",
  md: "w-[min(92vw,32rem)]",
  lg: "w-[min(94vw,56rem)]",
};

/**
 * Accessible modal built on the native <dialog> element, which provides focus
 * trapping, Escape-to-close, inertness of background content, and the top
 * layer — all without an animation or UI library.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  hideCloseButton = false,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const t = useTranslations("Common");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        // Native <dialog> reports backdrop clicks with the dialog as target.
        if (event.target === event.currentTarget) onOpenChange(false);
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-xl",
        dialogSizes[size],
        "backdrop:bg-foreground/40",
        className,
      )}
    >
      <div className="flex flex-col">
        <header className="flex items-start justify-between gap-4 p-5 pb-3">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {hideCloseButton ? null : (
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span aria-hidden className="text-lg leading-none">
                &times;
              </span>
              <VisuallyHidden>{t("closeDialog")}</VisuallyHidden>
            </button>
          )}
        </header>

        <div className="px-5 pb-2">{children}</div>

        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2 p-5 pt-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
