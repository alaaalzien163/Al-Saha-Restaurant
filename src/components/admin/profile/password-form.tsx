"use client";

import {
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/components/ui/toast";
import { changePassword } from "@/app/[lang]/admin/(dashboard)/profile/actions";
import {
  MIN_PASSWORD_LENGTH,
  type PasswordActionResult,
} from "@/lib/validations/profile";

/** Password change form. Delegates entirely to Supabase Auth. */
export function PasswordForm() {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<PasswordActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
  const formError = result && !result.ok ? result.message : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await changePassword(formData);
      setResult(response);
      if (response.ok) {
        formRef.current?.reset();
        toast({ title: t("profile.password.updatedToast"), variant: "success" });
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        id={`${formId}-current`}
        label={t("profile.password.current")}
        error={fieldErrors?.current_password}
        required
      >
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="current_password"
            autoComplete="current-password"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-new`}
        label={t("profile.password.new")}
        description={t("profile.password.newHint", { min: MIN_PASSWORD_LENGTH })}
        error={fieldErrors?.new_password}
        required
      >
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="new_password"
            autoComplete="new-password"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-confirm`}
        label={t("profile.password.confirm")}
        error={fieldErrors?.confirm_password}
        required
      >
        {({ id, describedBy, invalid }) => (
          <PasswordInput
            id={id}
            name="confirm_password"
            autoComplete="new-password"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
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

      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          {t("profile.password.submit")}
        </Button>
      </div>
    </form>
  );
}
