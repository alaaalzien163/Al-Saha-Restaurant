"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Brand } from "@/components/layout/brand";
import { AdminNav } from "./admin-nav";
import { CloseIcon, MenuIcon } from "./admin-icons";

const MENU_ID = "admin-navigation";

/**
 * Mobile/tablet admin navigation.
 *
 * A full-screen drawer built on the native <dialog> (focus trapping, Escape,
 * background inertness for free). This is the only client JS in the shell,
 * alongside the shared active-state nav.
 */
export function AdminMobileNav() {
  const t = useTranslations("Admin");
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

  /* Close after navigating (syncs the external <dialog> state). */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  /* Close if the viewport grows into the desktop layout. */
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) close();
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [close]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-label={
          open ? t("mobileNav.close") : t("mobileNav.open")
        }
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
      >
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>

      <dialog
        ref={dialogRef}
        id={MENU_ID}
        aria-label={t("mobileNav.label")}
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
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Brand onNavigate={close} />
            <button
              type="button"
              onClick={close}
              aria-label={t("mobileNav.close")}
              className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <AdminNav onNavigate={close} />
          </div>
        </div>
      </dialog>
    </div>
  );
}
