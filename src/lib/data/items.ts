import { cacheLife } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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

/** All items (available or not), optionally filtered by category. */
export async function getAdminItems(categoryId?: string): Promise<MenuItem[]> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const query = supabase
    .from("items")
    .select(ADMIN_ITEM_COLUMNS)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const { data, error } = await (categoryId
    ? query.eq("category_id", categoryId)
    : query);

  if (error) {
    throw new Error(`Failed to load items: ${error.message}`);
  }

  return data ?? [];
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
