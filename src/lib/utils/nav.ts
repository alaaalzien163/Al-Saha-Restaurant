/**
 * Whether a nav item should be marked as the current page.
 *
 * A prefix match keeps parent items highlighted for nested routes (e.g.
 * `/admin/categories/new` highlights `/admin/categories`). Callers that need an
 * exact match for an index route should compare directly.
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
