import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils/site-url";

/**
 * `robots.txt`.
 *
 * Everything public is crawlable; the whole admin area is disallowed in every
 * locale the router can produce (`/admin`, `/en/admin`, `/ar/admin` and their
 * children). The URL prefix comes from the site URL helper, so no domain is
 * ever hardcoded here.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/*/admin", "/*/admin/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
