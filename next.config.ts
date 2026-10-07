import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * `next dev` only. A locally-hosted Supabase (`http://127.0.0.1:...`) is the
 * only reason HTTP image hosts are ever needed, and production must never
 * allow them - so they are compiled in for development and left out of the
 * production build entirely.
 */
const isDevelopment = process.env.NODE_ENV === "development";


/** Supabase Storage (the only remote image source the app loads). */
const SUPABASE_STORAGE_PATTERN = {
  protocol: "https",
  hostname: "**.supabase.co",
  pathname: "/storage/v1/object/public/**",
} as const;

const LOCAL_SUPABASE_STORAGE_PATTERNS = [
  {
    protocol: "http",
    hostname: "127.0.0.1",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "http",
    hostname: "localhost",
    pathname: "/storage/v1/object/public/**",
  },
] as const;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      SUPABASE_STORAGE_PATTERN,
      ...(isDevelopment ? LOCAL_SUPABASE_STORAGE_PATTERNS : []),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);

