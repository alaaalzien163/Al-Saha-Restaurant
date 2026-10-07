"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { VisuallyHidden } from "./visually-hidden";

export type ToastVariant = "default" | "success" | "danger";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. Use 0 to require manual dismissal. */
  duration?: number;
};

type ToastRecord = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 5000;

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within <ToastProvider>.");
  }
  return context;
}

const variantClasses: Record<ToastVariant, string> = {
  default: "border-border",
  success: "border-success/40",
  danger: "border-danger/40",
};

/**
 * Minimal, dependency-free toast foundation.
 *
 * Mount <ToastProvider> near the app root, then call `useToast().toast(...)`
 * from client components. Notifications render into an aria-live region so
 * they are announced to assistive technology.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      const duration = options.duration ?? DEFAULT_DURATION;
      const record: ToastRecord = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "default",
        duration,
      };

      setToasts((current) => [...current, record]);

      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        );
      }

      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-md border bg-card p-4 text-card-foreground shadow-lg",
              variantClasses[item.variant],
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{item.title}</p>
                {item.description ? (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span aria-hidden className="text-base leading-none">
                  &times;
                </span>
                <VisuallyHidden>{t("dismissNotification")}</VisuallyHidden>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
