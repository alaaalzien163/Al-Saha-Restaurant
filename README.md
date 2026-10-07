# Al-Saha Resto

Production-grade restaurant website with a Supabase-backed admin dashboard.
This repository currently contains the **project foundation only** — no public
or admin UI has been built yet.

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
| `NEXT_PUBLIC_SITE_URL` | optional | Absolute site URL for metadata. |

> The `service_role` key is **never** used in this application. Authorization is
> enforced by Supabase RLS, which is the final security layer.

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
├─ app/                     # App Router
│  ├─ (public)/             # Public website route group
│  ├─ admin/
│  │  ├─ login/             # Server action login + client form
│  │  └─ (dashboard)/       # Server-guarded admin area
│  ├─ error.tsx             # Global error boundary
│  ├─ global-error.tsx      # Root error boundary
│  ├─ loading.tsx           # Global loading UI
│  ├─ not-found.tsx         # Global 404
│  └─ globals.css           # Design tokens + base styles
├─ components/
│  ├─ layout/               # Header/footer shells
│  └─ ui/                   # Reusable primitives
├─ config/                  # Site config (copy, nav)
├─ lib/
│  ├─ auth/                 # Session helpers + admin guard
│  ├─ data/                 # Centralized data access
│  ├─ supabase/             # Browser/server clients, env, proxy helper
│  ├─ utils/                # Small pure helpers
│  └─ validations/          # Dependency-free validators
├─ types/                   # Supabase + domain types
└─ proxy.ts                 # Next.js proxy (middleware): session refresh
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
- **Request dedupe.** Read helpers and the auth helper are wrapped in React
  `cache()` to avoid duplicate work within a request.
- **Data types.** `src/types/database.ts` mirrors the existing schema. Regenerate
  it against the live project (do not hand-edit columns long-term):

  ```bash
  npx supabase gen types typescript --project-id <project-id> --schema public > src/types/database.ts
  ```
