import { cache } from "react";
import type { MenuSection, PublicMenuItem } from "@/types/domain";
import { getActiveCategories } from "./categories";
import { getAvailableItems } from "./items";

/**
 * The public menu: active categories, each with their available items ordered
 * by `display_order`.
 *
 * - Categories and items are fetched in parallel (`Promise.all`) so there is no
 *   request waterfall.
 * - Both underlying reads are themselves `cache`d, so if any other server
 *   component needs categories or items this request, no extra queries run.
 * - Active categories are always returned, even with no available items, so the
 *   menu can show a per-category empty state instead of silently hiding them.
 */
export const getMenu = cache(async (): Promise<MenuSection[]> => {
  const [categories, items] = await Promise.all([
    getActiveCategories(),
    getAvailableItems(),
  ]);

  const itemsByCategory = new Map<string, PublicMenuItem[]>();
  for (const item of items) {
    const bucket = itemsByCategory.get(item.category_id);
    if (bucket) {
      bucket.push(item);
    } else {
      itemsByCategory.set(item.category_id, [item]);
    }
  }

  return categories.map((category) => ({
    category,
    items: itemsByCategory.get(category.id) ?? [],
  }));
});
