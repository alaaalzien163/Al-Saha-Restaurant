import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SkipLink } from "@/components/ui/skip-link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink href="#content">{t("skipToContent")}</SkipLink>
      <SiteHeader />
      <main id="content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
