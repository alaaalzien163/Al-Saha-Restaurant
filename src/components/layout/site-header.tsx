import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Brand } from "./brand";
import { MobileNav } from "./mobile-nav";
import { desktopNavLinkClass } from "./nav-styles";
import { Link } from "@/i18n/navigation";

/**
 * Public site header.
 *
 * Server Component: the brand, desktop navigation, language switcher and theme
 * toggle ship no JavaScript of their own. Only the mobile navigation (an
 * interactive disclosure) is a client island.
 */
export function SiteHeader() {
  const t = useTranslations("Navigation");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Brand
          showLogo
          showWordmark={false}
          href="/admin/login"
          logoAlt={t("logoAlt")}
          label={t("logoAdminLink")}
        />

        <div className="flex items-center gap-2">
          <nav aria-label={t("primary")} className="hidden md:block">
            <ul className="flex items-center gap-1">
              {siteConfig.publicNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={desktopNavLinkClass}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitcher className="hidden md:flex" />
          <ThemeToggle className="hidden md:inline-flex" />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
