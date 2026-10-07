"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { isActivePath } from "@/lib/utils/nav";
import { adminNavIcons } from "./admin-icons";

export type AdminNavProps = {
  /** Called when a link is activated, used by the mobile drawer to close. */
  onNavigate?: () => void;
  className?: string;
};

/**
 * The single source of admin navigation links, shared by the desktop sidebar
 * and the mobile drawer so the active-state logic lives in exactly one place.
 */
export function AdminNav({ onNavigate, className }: AdminNavProps) {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  return (
    <nav aria-label={t("nav.label")} className={className}>
      <ul className="flex flex-col gap-1">
        {siteConfig.adminNav.map((item) => {
          // "/admin" (Overview) must match exactly; others match nested routes.
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : isActivePath(pathname, item.href);
          const Icon = adminNavIcons[item.key];

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {t(`nav.${item.key}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
