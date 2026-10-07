import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/domain";
import { CategoryRowActions } from "./category-row-actions";

export type CategoriesViewProps = {
  categories: Category[];
};

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <Badge variant={active ? "success" : "secondary"}>
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

/**
 * Responsive categories view: a data table on desktop and stacked cards on
 * small screens (no horizontally scrolling table on mobile).
 */
export async function CategoriesView({ categories }: CategoriesViewProps) {
  const t = await getTranslations("Admin");
  const activeLabel = t("status.active");
  const inactiveLabel = t("status.inactive");

  return (
    <>
      {/* Desktop table (scrolls rather than clipping if columns get tight). */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-sm lg:block">
        <table className="w-full text-start text-sm">
          <caption className="sr-only">{t("categories.caption")}</caption>
          <thead className="border-b border-border bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.order")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.name")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.description")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.status")}
              </th>
              <th scope="col" className="px-4 py-3 text-end font-medium">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-border last:border-0 align-top"
              >
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {category.display_order}
                </td>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  {category.name}
                </th>
                <td className="max-w-xs px-4 py-3 text-muted-foreground">
                  {category.description ?? (
                    <span aria-hidden="true">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    active={category.is_active}
                    activeLabel={activeLabel}
                    inactiveLabel={inactiveLabel}
                  />
                </td>
                <td className="px-4 py-3">
                  <CategoryRowActions category={category} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <ul className="space-y-3 lg:hidden">
        {categories.map((category) => (
          <li
            key={category.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-medium text-foreground">
                  {category.name}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("categories.displayOrder", {
                    order: category.display_order,
                  })}
                </p>
              </div>
              <StatusBadge
                active={category.is_active}
                activeLabel={activeLabel}
                inactiveLabel={inactiveLabel}
              />
            </div>

            {category.description ? (
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {category.description}
              </p>
            ) : null}

            <div className="mt-3 border-t border-border pt-3">
              <CategoryRowActions category={category} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
