import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Brand } from "@/components/layout/brand";
import { AdminNav } from "./admin-nav";

/** Desktop admin sidebar. Hidden below `lg`, where the drawer takes over. */
export async function AdminSidebar() {
  const t = await getTranslations("Admin");

  return (
    <aside className="hidden border-e border-border bg-card lg:fixed lg:inset-y-0 lg:start-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <AdminNav />
      </div>
      <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
        {t("sidebar.footer", { name: siteConfig.shortName })}
      </div>
    </aside>
  );
}
