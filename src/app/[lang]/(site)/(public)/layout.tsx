import type { ReactNode } from "react";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { SkipLink } from "@/components/ui/skip-link";
import { AnnouncementBar } from "@/components/announcements";
import { SplashScreen } from "@/components/splash";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");

  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink href="#content">{t("skipToContent")}</SkipLink>
      {/*
        Behind Suspense so the bar streams in without pulling the rest of the
        layout out of the static shell. No skeleton: the bar is optional, so an
        empty fallback is better than reserving space that may never be filled.
      */}
      <Suspense fallback={null}>
        <AnnouncementBar />
      </Suspense>
      <SiteHeader />
      <main id="content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {/*
        Mounted here, once, for the whole public area: it lasts one browser page
        load and is never rendered by the admin area. Kept last in the markup so
        it stays out of the way of the page's reading order.
      */}
      <SplashScreen />
    </div>
  );
}
