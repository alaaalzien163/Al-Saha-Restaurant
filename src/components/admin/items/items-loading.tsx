import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export type AdminItemsLoadingProps = {
  /** Localized accessible label, e.g. "Loading" / "جارٍ التحميل". */
  label: string;
};

/**
 * Lightweight placeholder for the Admin Items page.
 *
 * Rendered as the `<Suspense>` fallback in the static shell, so it must not read
 * URL data, the session, or any protected rows. Layout mirrors the real page
 * (header, filter toolbar, list) and uses theme tokens, so it matches both
 * locales/RTL and the light/dark palettes without any client JavaScript.
 */
export function AdminItemsLoading({ label }: AdminItemsLoadingProps) {
  return (
    <div role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}</span>

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Search + filter toolbar */}
      <div className="mb-5 space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Item list */}
      <div className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-sm">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 py-2.5">
            <Skeleton className="size-12 shrink-0" />
            <div className="min-w-0 flex-1">
              <SkeletonText lines={1} className="max-w-xs" />
            </div>
            <Skeleton className="hidden h-4 w-24 shrink-0 sm:block" />
            <Skeleton className="h-6 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
