import type { ReactNode } from "react";

export type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** Optional primary action rendered on the right. */
  action?: ReactNode;
};

/** Consistent page-level heading for admin pages. */
export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-prose text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
