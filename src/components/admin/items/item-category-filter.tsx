import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils/cn";
import type { CategoryOption } from "./item-form";

export type ItemCategoryFilterProps = {
  categories: CategoryOption[];
  activeCategoryId?: string;
};

const base =
  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors";

function chipClass(active: boolean): string {
  return cn(
    base,
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
  );
}

/** Server-rendered category filter (plain links — no client JavaScript). */
export async function ItemCategoryFilter({
  categories,
  activeCategoryId,
}: ItemCategoryFilterProps) {
  const t = await getTranslations("Admin");

  return (
    <nav aria-label={t("items.filter.label")} className="mb-5">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/admin/items"
            aria-current={!activeCategoryId ? "true" : undefined}
            className={chipClass(!activeCategoryId)}
          >
            {t("items.filter.all")}
          </Link>
        </li>
        {categories.map((category) => {
          const active = activeCategoryId === category.id;
          return (
            <li key={category.id}>
              <Link
                href={`/admin/items?category=${category.id}`}
                aria-current={active ? "true" : undefined}
                className={chipClass(active)}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
