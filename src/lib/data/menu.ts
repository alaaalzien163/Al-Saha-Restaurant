import { cache } from "react";
import type {
  MenuSection,
  PublicCategory,
  PublicMenuItem,
} from "@/types/domain";
import { getActiveCategories } from "./categories";
import { getAvailableItems } from "./items";

function groupSections(
  categories: PublicCategory[],
  items: PublicMenuItem[],
): MenuSection[] {
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
}

/**
 * The public menu: active categories, each with their available items ordered
 * by `display_order`.
 *
 * - Active categories are always returned, even with no available items, so the
 *   menu can show a per-category empty state instead of hiding them.
 * - Cached per request so the homepage preview and menu page share one read.
 */
export const getMenu = cache(async (): Promise<MenuSection[]> => {
  const [categories, items] = await Promise.all([
    getActiveCategories(),
    getAvailableItems(),
  ]);

  return groupSections(categories, items);
});
