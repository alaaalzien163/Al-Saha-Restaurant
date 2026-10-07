import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { AdminLayout } from "@/components/admin";

/**
 * Protected admin layout.
 *
 * `requireAdmin()` verifies the Supabase session on the server for every
 * request and redirects unauthenticated users before any admin content renders.
 * Authorization never depends on client-side checks.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
