"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

type DropdownMenuContextValue = {
  close: () => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "DropdownMenu components must be used within <DropdownMenu>.",
    );
  }
  return context;
}

export type DropdownMenuProps = {
  /** Content of the trigger button. */
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  /** Accessible name for the trigger when it has no visible text. */
  label?: string;
  className?: string;
};

/**
 * Keyboard-accessible dropdown menu (button + role="menu").
 *
 * Supports ArrowUp/Down, Home/End, Escape (returns focus to the trigger),
 * outside-click dismissal, and closes automatically when an item is chosen.
 */
export function DropdownMenu({
  trigger,
  children,
  align = "end",
  label,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>(
      '[role="menuitem"]',
    );
    first?.focus();
  }, [open]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const menu = menuRef.current;
    if (!menu) return;

    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    if (items.length === 0) return;

    const activeIndex = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = activeIndex < 0 ? 0 : (activeIndex + 1) % items.length;
        items[next]?.focus();
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
        items[prev]?.focus();
        break;
      }
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-start", className)}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        {trigger}
      </button>

      {open ? (
        <DropdownMenuContext.Provider value={{ close }}>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            onKeyDown={handleMenuKeyDown}
            className={cn(
              "absolute z-50 mt-1 min-w-48 overflow-hidden rounded-md border border-border bg-card p-1 text-card-foreground shadow-lg",
              align === "end" ? "end-0" : "start-0",
            )}
          >
            {children}
          </div>
        </DropdownMenuContext.Provider>
      ) : null}
    </div>
  );
}

export type DropdownMenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "danger";
  /** Extra left padding, for items aligned under an icon. */
  inset?: boolean;
};

export function DropdownMenuItem({
  variant = "default",
  inset = false,
  className,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const { close } = useDropdownMenuContext();

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) close();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-start text-sm transition-colors",
        variant === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-foreground hover:bg-muted",
        inset && "ps-8",
        className,
      )}
      {...props}
    />
  );
}

export type DropdownMenuLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function DropdownMenuLink({
  className,
  onClick,
  ...props
}: DropdownMenuLinkProps) {
  const { close } = useDropdownMenuContext();

  return (
    <a
      role="menuitem"
      tabIndex={-1}
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div role="separator" className={cn("my-1 h-px bg-border", className)} />
  );
}
