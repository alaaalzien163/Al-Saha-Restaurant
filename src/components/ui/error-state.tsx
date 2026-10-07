"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Recovery action slot (e.g. a retry Button). */
  action?: ReactNode;
  className?: string;
};

/** Inline error surface. */
export function ErrorState({
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  const t = useTranslations("Errors");
  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("stateDescription");
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-danger/30 bg-danger/5 px-6 py-10 text-center",
        className,
      )}
    >
      <h2 className="text-base font-semibold text-danger">{resolvedTitle}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground text-balance">
        {resolvedDescription}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
