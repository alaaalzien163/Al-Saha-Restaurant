"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { isActivePath, mobileNavLinkClass } from "./nav-styles";

const MENU_ID = "mobile-navigation";

/**
 * Mobile-only navigation.
 *
 * Implemented with the native <dialog> element opened via `showModal()`, which
 * provides focus trapping, Escape-to-close, background inertness and the top
 * layer for free. This is the only part of the header that needs client JS.
 */
export function MobileNav() {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  /* Close the menu after navigating (syncs the external <dialog> state). */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  /* Close if the viewport grows into the desktop layout. */
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) close();
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [close]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={open ? t("closeMenu") : t("openMenu")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
      >
        <span aria-hidden="true" className="flex w-5 flex-col items-center gap-1.5">
          <span
            className={cn(
              "block h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
              open && "translate-y-2 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-5 rounded-full bg-current transition-transform duration-200",
              open && "-translate-y-2 -rotate-45",
            )}
          />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id={MENU_ID}
        aria-label={t("siteNav")}
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className={cn(
          "fixed inset-0 m-0 h-auto w-auto max-w-none max-h-none rounded-none border-0 bg-background p-0 text-foreground",
          "backdrop:bg-foreground/40",
        )}
      >
        <div className="flex h-full min-h-dvh flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-[var(--page-gutter)]">
            <Brand
              onNavigate={close}
              showLogo
              showWordmark={false}
              href="/admin/login"
              logoAlt={t("logoAlt")}
              label={t("logoAdminLink")}
            />
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                type="button"
                onClick={close}
                aria-label={t("closeMenu")}
                className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-6"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          <nav
            aria-label={t("primary")}
            className="flex-1 overflow-y-auto px-[var(--page-gutter)] py-4"
          >
            <ul className="flex flex-col gap-1">
              {siteConfig.publicNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={close}
                      className={mobileNavLinkClass(active)}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </dialog>
    </div>
  );
}
