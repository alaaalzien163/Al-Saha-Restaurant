/**
 * Only allow same-origin, absolute paths for post-login redirects.
 * Blocks protocol-relative (`//evil.com`) and absolute URL redirects.
 */
export function safeRedirectPath(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string") return fallback;

  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;

  return path;
}
