/**
 * Extracts the object path from a Supabase Storage *public* URL.
 *
 * e.g. https://proj.supabase.co/storage/v1/object/public/menu-images/items/a.jpg
 *      -> "items/a.jpg"
 *
 * Returns null when the URL does not belong to the given bucket, so callers
 * never attempt to delete something outside their own bucket.
 */
export function storagePathFromPublicUrl(
  url: string | null | undefined,
  bucket: string,
): string | null {
  if (!url) return null;

  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;

  const rawPath = url.slice(index + marker.length).split("?")[0];
  if (!rawPath) return null;

  try {
    return decodeURIComponent(rawPath);
  } catch {
    return rawPath;
  }
}
