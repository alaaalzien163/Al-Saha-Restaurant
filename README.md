# Al-Saha Restaurant

Production restaurant website (Arabic-first, RTL) with a bilingual public menu
and a Supabase-backed admin dashboard for one fixed restaurant.

## Tech stack

- Next.js (App Router) + React
- TypeScript (strict)
- Tailwind CSS v4 (CSS-variable design tokens)
- Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- Supabase Auth + Row Level Security (RLS)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Safe to expose to the browser. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Publishable key, safe to expose. |
| `NEXT_PUBLIC_SITE_URL` | yes in production | Absolute public origin used by canonical/OG URLs, `robots.txt` and `sitemap.xml`. Preview deployments fall back to Vercel's deployment host. |

> The `service_role` key is **never** used in this application. Authorization is
> enforced by Supabase RLS, which is the final security layer.

## Deploying to Vercel

1. Import the repository and keep the default build command (`npm run build`).
2. Add the three variables above to the Production environment (and to Preview
   if preview URLs should publish their own origin).
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` origin, with no trailing
   slash, so metadata never falls back to a Vercel host or localhost.

No server-only secret is read by the source; the publishable key plus RLS is the
whole contract.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | Generate route types and run `tsc --noEmit`. |
| `npm run check` | Type-check + lint. |

## Project structure

```text
src/
├─ app/
│  ├─ [lang]/                 # locale segment (ar default, en prefixed)
│  │  ├─ (site)/
│  │  │  ├─ (public)/         # homepage, menu, contact
│  │  │  └─ admin/            # login + server-guarded (dashboard)
│  │  ├─ layout.tsx           # <html lang/dir>, theme + i18n providers
│  │  ├─ error.tsx            # locale error boundary
│  │  └─ not-found.tsx        # localized 404 inside the locale layout
│  ├─ not-found.tsx           # global 404 for unmatched URLs
│  ├─ global-error.tsx        # root error boundary
│  ├─ robots.ts               # /robots.txt
│  └─ sitemap.ts              # /sitemap.xml
├─ components/                # layout, sections, menu, admin, ui, …
├─ config/                    # site config (brand, nav, contact)
├─ i18n/                      # routing, constants, SEO helpers
├─ lib/
│  ├─ auth/                   # session helpers + admin guard
│  ├─ data/                   # centralized Supabase data access
│  ├─ supabase/               # browser/server clients, env, proxy helper
│  ├─ hooks/                  # small client hooks
│  ├─ utils/                  # small pure helpers
│  └─ validations/            # dependency-free validators
├─ types/                     # Supabase + domain types
└─ proxy.ts                   # next-intl routing + session refresh + admin redirect
```

## Architecture notes

- **Server-first.** Public content and data fetching live in Server Components.
  `"use client"` is limited to the error boundaries and the login form.
- **Centralized Supabase access.** All queries go through `src/lib/data/*`, which
  uses the server client. Presentation components never talk to Supabase directly.
- **Two clients.** `src/lib/supabase/client.ts` (browser) and
  `src/lib/supabase/server.ts` (per-request, cookie-based).
- **Auth.** `src/proxy.ts` refreshes the session and performs an optimistic
  redirect; `requireAdmin()` in `src/lib/auth/session.ts` is the authoritative
  server check. RLS remains the final authorization layer.
- **Request dedupe.** Public reads use `'use cache: private'` + `cacheLife` so
  they are deduped per request (never shared across users) and stay out of the
  static shell; menu grouping additionally uses React `cache()`.
- **Data types.** `src/types/database.ts` mirrors the existing schema. Regenerate
  it against the live project (do not hand-edit columns long-term):

  ```bash
  npx supabase gen types typescript --project-id <project-id> --schema public > src/types/database.ts
  ```
