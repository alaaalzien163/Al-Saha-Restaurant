/**
 * Absolute base URL for every URL the app emits outside a document:
 * canonical / hreflang links, Open Graph, `robots.txt` and `sitemap.xml`.
 *
 * Resolution order - no domain is ever hardcoded in source:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` - the one value that must be set per Vercel
 *    environment (e.g. `https://alsaharesto.com`). Read from the environment so
 *    production, preview and local runs can all differ without a code change.
 * 2. Vercel's own deployment hosts - so a Preview deployment publishes its own
 *    absolute URLs instead of silently falling back to localhost.
 * 3. `http://localhost:3000` - local development only.
 *
 * Server-side only: steps 2 reads non-public Vercel variables, so this module
 * must not be imported from a Client Component.
 */
function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/** Absolute site origin, without a trailing slash. */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return stripTrailingSlash(configured);

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return `https://${stripTrailingSlash(vercelHost)}`;

  return "http://localhost:3000";
}

/**
 * Absolute URL for an app-relative path (`/menu` -> `https://host/menu`).
 * Absolute inputs are returned unchanged.
 */
export function absoluteUrl(path: string = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
