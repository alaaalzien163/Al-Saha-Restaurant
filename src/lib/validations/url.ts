/**
 * Whether a stored destination is safe to render as a link or an image source.
 *
 * Only two shapes are allowed: an in-app absolute path (`/menu`, `/images/…`)
 * and an `https://` URL. Protocol-relative (`//evil.example`), backslash
 * variants (`/\evil.example` — browsers treat `\` as `/`), and every other
 * scheme (`javascript:`, `data:`, plain `http:`) are rejected, so a stored
 * value can never become a script or cross-origin redirect.
 */
export function isSafeHttpOrPathUrl(url: string): boolean {
  if (/[\\\r\n]/.test(url)) return false;
  if (url.startsWith("/")) return !url.startsWith("//");
  if (url.startsWith("https://")) {
    try {
      return new URL(url).protocol === "https:";
    } catch {
      return false;
    }
  }
  return false;
}
