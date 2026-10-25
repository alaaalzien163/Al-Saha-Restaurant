import { cacheLife } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { toPostgrestLikePattern } from "@/lib/utils/search";
import type { MenuItem, PublicMenuItem } from "@/types/domain";
import type { TableInsert, TableUpdate } from "@/types/database";

/* ------------------------------------------------------------------ Public */

/**
 * Available items, ordered for display. Deduped per request.
 * Selects only public columns so admin-only fields never leak.
 *
 * Private-cached: it reads the request cookies (Supabase session) and is kept
 * out of the static shell, so Supabase's internal `Date.now()` is not flagged
 * as prerender-blocking sync IO. `stale: Infinity` keeps it request-scoped.
 */
export async function getAvailableItems(): Promise<PublicMenuItem[]> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select(
      "id, category_id, name, description, price, image_url, display_order, is_available",
    )
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load menu items: ${error.message}`);
  }

  return data ?? [];
}

/* ------------------------------------------------------------------- Admin */

const ADMIN_ITEM_COLUMNS =
  "id, category_id, name, description, price, image_url, display_order, is_available, created_at, updated_at";

/** Sort orders offered by the admin item list. */
export type AdminItemsSort = "order" | "name" | "price_asc" | "price_desc";

/** Availability filter for the admin item list. */
export type AdminItemsAvailability = "all" | "available" | "unavailable";

/** Filters accepted by the admin item list. */
export type AdminItemsPageQuery = {
  /** Show a single category. */
  categoryId?: string;
  search?: string;
  availability?: AdminItemsAvailability;
  sort?: AdminItemsSort;
  page?: number;
  pageSize?: number;
};

export type AdminItemsPageResult = {
  items: MenuItem[];
  /** Number of items matching the filters, across every page. */
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const ADMIN_ITEMS_PAGE_SIZE = 10;

/** Minimum/maximum page size, so a crafted `pageSize` cannot exhaust the DB. */
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 50;

function clampPageSize(value: number | undefined): number {
  if (!Number.isFinite(value)) return ADMIN_ITEMS_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, Math.floor(value!)));
}

/** Whole pages only; anything invalid falls back to the first page. */
function normalizePage(value: number | undefined): number {
  if (!Number.isFinite(value) || (value as number) < 1) return 1;
  return Math.floor(value as number);
}

/**
 * One page of admin items, filtered/sorted in PostgREST rather than in memory,
 * so search, availability, sort and pagination stay correct as the menu grows.
 */
export async function getAdminItemsPage(
  query: AdminItemsPageQuery,
): Promise<AdminItemsPageResult> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const pageSize = clampPageSize(query.pageSize);
  const requestedPage = normalizePage(query.page);

  const supabase = await createClient();
  let request = supabase
    .from("items")
    .select(ADMIN_ITEM_COLUMNS, { count: "exact" });

  if (query.categoryId) {
    request = request.eq("category_id", query.categoryId);
  }

  const pattern = toPostgrestLikePattern(query.search ?? "");
  if (pattern) {
    request = request.or(
      `name.ilike.${pattern},description.ilike.${pattern}`,
    );
  }

  if (query.availability === "available") {
    request = request.eq("is_available", true);
  } else if (query.availability === "unavailable") {
    request = request.eq("is_available", false);
  }

  switch (query.sort) {
    case "name":
      request = request
        .order("name", { ascending: true })
        .order("display_order", { ascending: true });
      break;
    case "price_asc":
      // Null prices sort last in both directions, so items without a price
      // never break the comparison.
      request = request.order("price", {
        ascending: true,
        nullsFirst: false,
      });
      break;
    case "price_desc":
      request = request.order("price", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    default:
      request = request
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      break;
  }

  const from = (requestedPage - 1) * pageSize;
  const { data, count, error } = await request.range(
    from,
    from + pageSize - 1,
  );

  if (error) {
    throw new Error(`Failed to load items: ${error.message}`);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: data ?? [],
    total,
    page: requestedPage,
    pageSize,
    totalPages,
  };
}

export async function getAdminItemById(id: string): Promise<MenuItem | null> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select(ADMIN_ITEM_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load item: ${error.message}`);
  }

  return data;
}

export async function insertItem(
  values: TableInsert<"items">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("items").insert(values);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateItemRecord(
  id: string,
  patch: TableUpdate<"items">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("items").update(patch).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<void> {
  await updateItemRecord(id, { is_available: isAvailable });
}

export async function deleteItemRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
