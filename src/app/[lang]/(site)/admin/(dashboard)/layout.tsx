import { Suspense } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { requireAdmin } from "@/lib/auth/session";
import { AdminLayout } from "@/components/admin";
import { Spinner } from "@/components/ui/spinner";

/**
 * Protected admin layout.
 *
 * `requireAdmin()` verifies the Supabase session on the server for every
 * request and redirects unauthenticated users before any admin content renders.
 * Authorization never depends on client-side checks.
 *
 * The session read runs inside a `'use cache: private'` scope, which Next
 * excludes from the static shell on its own — no `connection()` marker is
 * needed or allowed there. The shell therefore prerenders `AdminShellFallback`
 * and the authenticated chrome streams in behind the `<Suspense>` boundary on
 * every request.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </Suspense>
  );
}

/**
 * Runs at request time only (the private-cache session read creates the
 * dynamic hole), so no user's session can ever be baked into shared output.
 * `children` are held behind the same boundary: nothing in the admin area
 * renders before the auth check resolves.
 */
async function AdminDashboardShell({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}

/** Lightweight shell placeholder while the session is verified. */
function AdminShellFallback() {
  const t = useTranslations("Admin");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40">
      <Spinner className="text-muted-foreground" label={t("loading")} />
    </div>
  );
}
