"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createItem,
  updateItem,
} from "@/app/[lang]/(site)/admin/(dashboard)/items/actions";
import {
  ALLOWED_IMAGE_ACCEPT,
  formatFileSize,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/validations/image";
import type { ItemActionResult } from "@/lib/validations/item";
import type { MenuItem } from "@/types/domain";
import { ImageIcon, UploadIcon } from "../admin-icons";

export type CategoryOption = {
  id: string;
  name: string;
};

export type ItemFormProps = {
  mode: "create" | "edit";
  item?: MenuItem;
  categories: CategoryOption[];
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * The single reusable item form (create + edit) with client-side image preview.
 * The preview uses a local object URL (plain <img>) so no oversized original is
 * fetched; the stored image is always rendered with next/image.
 */
export function ItemForm({
  mode,
  item,
  categories,
  onSuccess,
  onCancel,
}: ItemFormProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ItemActionResult | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Revoke the previous object URL whenever it changes or on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
  const formError = result && !result.ok ? result.message : null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const check = validateImageFile(file);
    if (!check.ok) {
      setImageError(check.message);
      setPreview(null);
      event.target.value = "";
      return;
    }

    setImageError(null);
    setPreview(URL.createObjectURL(file));
  }

  function clearSelection() {
    setPreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const response =
        mode === "create" ? await createItem(formData) : await updateItem(formData);
      setResult(response);

      if (response.ok) {
        toast({
          title:
            mode === "create"
              ? t("items.form.createdToast")
              : t("items.form.updatedToast"),
          variant: "success",
        });
        onSuccess();
      }
    });
  }

  const imageFieldError = imageError ?? fieldErrors?.image;
  const currentImage = preview ?? item?.image_url ?? null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {mode === "edit" && item ? (
        <input type="hidden" name="id" value={item.id} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Field
            id={`${formId}-name`}
            label={t("items.form.name")}
            error={fieldErrors?.name}
            required
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="name"
                defaultValue={item?.name ?? ""}
                autoComplete="off"
                aria-describedby={describedBy}
                aria-invalid={invalid}
                disabled={isPending}
              />
            )}
          </Field>

          <Field
            id={`${formId}-category`}
            label={t("items.form.category")}
            error={fieldErrors?.category_id}
            required
          >
            {({ id, describedBy, invalid }) => (
              <Select
                id={id}
                name="category_id"
                defaultValue={item?.category_id ?? ""}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                disabled={isPending}
              >
                <option value="" disabled>
                  {t("items.form.categoryPlaceholder")}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id={`${formId}-price`}
              label={t("items.form.price")}
              error={fieldErrors?.price}
              required
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  defaultValue={item?.price ?? ""}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  disabled={isPending}
                />
              )}
            </Field>

            <Field
              id={`${formId}-order`}
              label={t("items.form.order")}
              description={t("items.form.orderHint")}
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
                  defaultValue={item?.display_order ?? 0}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  disabled={isPending}
                />
              )}
            </Field>
          </div>

          <Field
            id={`${formId}-description`}
            label={t("items.form.description")}
            error={fieldErrors?.description}
          >
            {({ id, describedBy, invalid }) => (
              <Textarea
                id={id}
                name="description"
                rows={4}
                defaultValue={item?.description ?? ""}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                disabled={isPending}
              />
            )}
          </Field>

          <div className="flex items-center gap-2.5">
            <input
              id={`${formId}-available`}
              name="is_available"
              type="checkbox"
              defaultChecked={item?.is_available ?? true}
              disabled={isPending}
              className="size-4 shrink-0 rounded border-border accent-primary"
            />
            <Label htmlFor={`${formId}-available`} className="font-normal">
              {t("items.form.availableLabel")}
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <span className="block text-sm font-medium text-foreground">
            {t("items.form.image")}
          </span>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
            {currentImage ? (
              preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt={t("items.form.previewAlt")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={currentImage}
                  alt={item?.name ?? t("items.form.imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              )
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 grid place-items-center text-muted-foreground/60"
              >
                <ImageIcon className="size-8" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            id={`${formId}-image`}
            name="image"
            type="file"
            accept={ALLOWED_IMAGE_ACCEPT}
            onChange={handleFileChange}
            disabled={isPending}
            className="sr-only"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              startIcon={<UploadIcon className="size-4" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              {currentImage
                ? t("items.form.replaceImage")
                : t("items.form.chooseImage")}
            </Button>
            {preview ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                disabled={isPending}
              >
                {t("items.form.clearSelection")}
              </Button>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground">
            {t("items.form.imageHint", {
              size: formatFileSize(MAX_IMAGE_BYTES),
            })}
          </p>

          {imageFieldError ? (
            <p role="alert" className="text-sm text-danger">
              {imageFieldError}
            </p>
          ) : null}
        </div>
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          {t("actions.cancel")}
        </Button>
        <Button type="submit" isLoading={isPending}>
          {mode === "create" ? t("items.form.create") : t("actions.save")}
        </Button>
      </div>
    </form>
  );
}
