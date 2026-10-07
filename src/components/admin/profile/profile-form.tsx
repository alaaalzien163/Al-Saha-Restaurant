"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { updateProfile } from "@/app/[lang]/(site)/admin/(dashboard)/profile/actions";
import type { ProfileActionResult } from "@/lib/validations/profile";
import type { Profile } from "@/types/domain";

export type ProfileFormProps = {
  profile: Profile | null;
  email: string | null;
};

/** Editable profile details. Email and role are read-only. */
export function ProfileForm({ profile, email }: ProfileFormProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const formId = useId();
  const [result, setResult] = useState<ProfileActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
  const formError = result && !result.ok ? result.message : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await updateProfile(formData);
      setResult(response);
      if (response.ok) {
        toast({ title: t("profile.form.updatedToast"), variant: "success" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        id={`${formId}-name`}
        label={t("profile.form.fullName")}
        error={fieldErrors?.full_name}
        required
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
            autoComplete="name"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-phone`}
        label={t("profile.form.phone")}
        error={fieldErrors?.phone}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={profile?.phone ?? ""}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field id={`${formId}-email`} label={t("profile.form.email")}>
        {({ id }) => (
          <Input
            id={id}
            type="email"
            value={email ?? ""}
            readOnly
            disabled
            className="bg-muted"
          />
        )}
      </Field>

      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-foreground">
          {t("profile.form.role")}
        </span>
        <Badge variant="secondary">{profile?.role ?? "admin"}</Badge>
      </div>

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
          {t("actions.save")}
        </Button>
      </div>
    </form>
  );
}
