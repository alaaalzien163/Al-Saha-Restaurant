import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category, PublicCategory } from "@/types/domain";
import type { TableInsert, TableUpdate } from "@/types/database";

/* ------------------------------------------------------------------ Public */

/**
 * Active categories, ordered for display. Deduped per request via React cache.
 *
 * Only public columns are selected, so any admin-only columns (e.g. timestamps)
 * can never leak to the public site.
 */
export const getActiveCategories = cache(
  async (): Promise<PublicCategory[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, description, display_order, is_active")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      throw new Error(`Failed to load categories: ${error.message}`);
    }

    return data ?? [];
  },
);

/* ------------------------------------------------------------------- Admin */

const ADMIN_COLUMNS =
  "id, name, description, display_order, is_active, created_at, updated_at";

/** Every category (active and inactive), ordered for management. */
export async function getAdminCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load categories: ${error.message}`);
  }

  return data ?? [];
}

export async function insertCategory(
  values: TableInsert<"categories">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert(values);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateCategoryRecord(
  id: string,
  patch: TableUpdate<"categories">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setCategoryActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  await updateCategoryRecord(id, { is_active: isActive });
}

export async function deleteCategoryRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
