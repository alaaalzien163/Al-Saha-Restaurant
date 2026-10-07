"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "./actions";
import { INITIAL_LOGIN_STATE } from "@/lib/auth/login-state";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.9 5.2A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1" />
      <path d="M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a10.4 10.4 0 0 0 4.1-.8" />
    </svg>
  );
}

export type LoginFormProps = {
  nextPath?: string;
  className?: string;
};

/**
 * Admin login form. The only client component on the page (it needs the
 * show/hide password state and the `useActionState` pending/error state).
 */
export function LoginForm({ nextPath, className }: LoginFormProps) {
  const t = useTranslations("Admin");
  const [state, formAction, isPending] = useActionState(
    signIn,
    INITIAL_LOGIN_STATE,
  );
  const [showPassword, setShowPassword] = useState(false);

  const formError = state.status === "error" ? state.message : null;

  return (
    <form
      action={formAction}
      noValidate
      className={cn("space-y-4", className)}
    >
      {nextPath ? (
        <input type="hidden" name="next" value={nextPath} />
      ) : null}

      <Field
        id="email"
        label={t("login.email")}
        error={state.fieldErrors.email}
        required
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id="password"
        label={t("login.password")}
        error={state.fieldErrors.password}
        required
      >
        {({ id, describedBy, invalid }) => (
          <div className="relative">
            <Input
              id={id}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              disabled={isPending}
              className="pe-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? t("login.hidePassword") : t("login.showPassword")
              }
              aria-pressed={showPassword}
              disabled={isPending}
              className="absolute inset-y-0 end-0 inline-flex w-11 items-center justify-center rounded-e-md text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        )}
      </Field>

      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {formError}
        </p>
      ) : null}

      <Button type="submit" className="w-full" isLoading={isPending}>
        {t("login.submit")}
      </Button>
    </form>
  );
}
