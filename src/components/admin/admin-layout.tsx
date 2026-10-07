import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { AdminUser } from "@/types/auth";
import { ToastProvider } from "@/components/ui/toast";
import { SkipLink } from "@/components/ui/skip-link";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";

export type AdminLayoutProps = {
  user: AdminUser;
  children: ReactNode;
};

/**
 * Reusable admin shell: fixed desktop sidebar, sticky header (with the mobile
 * drawer trigger and logout), and the page content area. A toast provider is
 * scoped to the dashboard so pages can surface success/error feedback.
 */
export async function AdminLayout({ user, children }: AdminLayoutProps) {
  const t = await getTranslations("Admin");

  return (
    <div className="min-h-dvh bg-muted/40">
      <SkipLink href="#admin-main">{t("skipToContent")}</SkipLink>
      <AdminSidebar />
      <div className="flex min-h-dvh flex-col lg:ps-64">
        <AdminHeader email={user.email} />
        <main id="admin-main" className="flex-1 p-4 sm:p-6 lg:p-8">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  );
}
