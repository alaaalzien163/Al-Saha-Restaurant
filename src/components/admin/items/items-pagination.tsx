import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type ItemsPaginationProps = {
  /** Admin item list path, without query string. */
  basePath: string;
  /** Active filters to preserve across pages (already serialised). */
  params: Record<string, string>;
  page: number;
  totalPages: number;
};

function pageHref(
  basePath: string,
  params: Record<string, string>,
  page: number,
): string {
  const query = new URLSearchParams(params);
  if (page > 1) query.set("page", String(page));
  const serialised = query.toString();
  return serialised ? `${basePath}?${serialised}` : basePath;
}

/** Server-rendered pagination: plain links, no client JavaScript. */
export async function ItemsPagination({
  basePath,
  params,
  page,
  totalPages,
}: ItemsPaginationProps) {
  if (totalPages <= 1) return null;

  const t = await getTranslations("Admin");
  const previousDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      aria-label={t("items.pagination.label")}
      className="mt-5 flex flex-wrap items-center justify-between gap-3"
    >
      {previousDisabled ? (
        <span
          aria-disabled="true"
          className={cn(
            buttonClasses({ variant: "outline", size: "sm" }),
            "opacity-60",
          )}
        >
          {t("items.pagination.previous")}
        </span>
      ) : (
        <Link
          href={pageHref(basePath, params, page - 1)}
          className={buttonClasses({ variant: "outline", size: "sm" })}
        >
          {t("items.pagination.previous")}
        </Link>
      )}

      <p className="text-sm text-muted-foreground tabular-nums">
        {t("items.pagination.page", { page, pages: totalPages })}
      </p>

      {nextDisabled ? (
        <span
          aria-disabled="true"
          className={cn(
            buttonClasses({ variant: "outline", size: "sm" }),
            "opacity-60",
          )}
        >
          {t("items.pagination.next")}
        </span>
      ) : (
        <Link
          href={pageHref(basePath, params, page + 1)}
          className={buttonClasses({ variant: "outline", size: "sm" })}
        >
          {t("items.pagination.next")}
        </Link>
      )}
    </nav>
  );
}
