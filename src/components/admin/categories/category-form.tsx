"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createCategory,
  updateCategory,
} from "@/app/[lang]/(site)/admin/(dashboard)/categories/actions";
import type { CategoryActionResult } from "@/lib/validations/category";
import type { Category } from "@/types/domain";

export type CategoryFormProps = {
  mode: "create" | "edit";
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * The single reusable category form used by both create and edit dialogs, so
 * CRUD form logic lives in exactly one place.
 */
export function CategoryForm({
  mode,
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const formId = useId();
  const [result, setResult] = useState<CategoryActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
  const formError = result && !result.ok ? result.message : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createCategory(formData)
          : await updateCategory(formData);

      setResult(response);

      if (response.ok) {
        toast({
          title:
            mode === "create"
              ? t("categories.form.createdToast")
              : t("categories.form.updatedToast"),
          variant: "success",
        });
        onSuccess();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {mode === "edit" && category ? (
        <input type="hidden" name="id" value={category.id} />
      ) : null}

      <Field
        id={`${formId}-name`}
        label={t("categories.form.name")}
        error={fieldErrors?.name}
        required
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="name"
            defaultValue={category?.name ?? ""}
            autoComplete="off"
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-description`}
        label={t("categories.form.description")}
        error={fieldErrors?.description}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="description"
            rows={3}
            defaultValue={category?.description ?? ""}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-order`}
        label={t("categories.form.order")}
        description={t("categories.form.orderHint")}
        error={fieldErrors?.display_order}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="display_order"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={category?.display_order ?? 0}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <div className="flex items-center gap-2.5">
        <input
          id={`${formId}-active`}
          name="is_active"
          type="checkbox"
          defaultChecked={category?.is_active ?? true}
          disabled={isPending}
          className="size-4 shrink-0 rounded border-border accent-primary"
        />
        <Label htmlFor={`${formId}-active`} className="font-normal">
          {t("categories.form.activeLabel")}
        </Label>
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          {t("actions.cancel")}
        </Button>
        <Button type="submit" isLoading={isPending}>
          {mode === "create"
            ? t("categories.form.create")
            : t("actions.save")}
        </Button>
      </div>
    </form>
  );
}
