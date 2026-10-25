import type {
  AdminItemsAvailability,
  AdminItemsSort,
} from "@/lib/data/items";

/** Filter state for the admin item list. */
export type AdminItemFilterValues = {
  q?: string;
  category?: string;
  availability?: AdminItemsAvailability;
  sort?: AdminItemsSort;
};

export const DEFAULT_ITEM_AVAILABILITY: AdminItemsAvailability = "all";
export const DEFAULT_ITEM_SORT: AdminItemsSort = "order";

/**
 * Serialises filter state to the non-default query parameters only, so the URL
 * stays short and a shared link describes exactly the visible filters.
 */
export function adminItemFilterParams(
  values: AdminItemFilterValues,
): Record<string, string> {
  const params: Record<string, string> = {};
  const search = values.q?.trim();

  if (search) params.q = search;
  if (values.category) params.category = values.category;
  if (values.availability && values.availability !== DEFAULT_ITEM_AVAILABILITY) {
    params.availability = values.availability;
  }
  if (values.sort && values.sort !== DEFAULT_ITEM_SORT) {
    params.sort = values.sort;
  }

  return params;
}

/** Builds a scoped admin item list URL (page 1 unless `page` is provided). */
export function adminItemsHref(
  basePath: string,
  values: AdminItemFilterValues,
  page?: number,
): string {
  const params = new URLSearchParams(adminItemFilterParams(values));
  if (page && page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Whether any non-default filter is active. */
export function hasAdminItemFilters(values: AdminItemFilterValues): boolean {
  return Object.keys(adminItemFilterParams(values)).length > 0;
}
