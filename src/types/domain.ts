import type { TableRow } from "./database";

/** Full category row, including admin-only timestamps. */
export type Category = TableRow<"categories">;

/**
 * Public subset of a category exposed to the public site. Keeps the public
 * query minimal (no timestamps) and documents exactly what is public.
 */
export type PublicCategory = Pick<
  Category,
  "id" | "name" | "description" | "display_order" | "is_active"
>;

/** A menu item as returned by Supabase. */
export type MenuItem = TableRow<"items">;

/** Public subset of a menu item exposed to the public site (no timestamps). */
export type PublicMenuItem = Pick<
  MenuItem,
  | "id"
  | "category_id"
  | "name"
  | "description"
  | "price"
  | "image_url"
  | "display_order"
  | "is_available"
>;

/** The authenticated admin's profile row (never exposed publicly). */
export type Profile = TableRow<"profiles">;

/** A category with its available items, ready to render. */
export type MenuSection = {
  category: PublicCategory;
  items: PublicMenuItem[];
};
