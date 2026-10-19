"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/app/[lang]/(site)/admin/(dashboard)/announcements/actions";
import type { AnnouncementActionResult } from "@/lib/validations/announcement";
import {
  localizedAnnouncement,
  toLocalDateTimeInputValue,
} from "@/lib/utils/announcements";
import type { Announcement } from "@/types/domain";

export type AnnouncementFormProps = {
  mode: "create" | "edit";
  announcement?: Announcement;
  onSuccess: () => void;
  onCancel: () => void;
};

const SCHEDULE_FIELDS = ["starts_at", "ends_at"] as const;

/**
 * Rewrites the `datetime-local` values into UTC ISO 8601 before submission.
 *
 * The browser is the only place that knows the admin's UTC offset, so the
 * conversion has to happen here; sending the raw local string would make the
 * schedule depend on the server's time zone.
 */
function normalizeSchedule(formData: FormData): FormData {
  for (const name of SCHEDULE_FIELDS) {
    const value = formData.get(name);
    if (typeof value !== "string" || value.trim() === "") continue;

    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      formData.set(name, parsed.toISOString());
    }
  }
  return formData;
}

/**
 * The single reusable announcement form (create + edit), so the CRUD form logic
 * lives in exactly one place. The message/link fields are controlled only so
 * the live preview below them can mirror what the public bar will render.
 */
export function AnnouncementForm({
  mode,
  announcement,
  onSuccess,
  onCancel,
}: AnnouncementFormProps) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const { toast } = useToast();
  const formId = useId();
  const [result, setResult] = useState<AnnouncementActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const [messageAr, setMessageAr] = useState(announcement?.message_ar ?? "");
  const [messageEn, setMessageEn] = useState(announcement?.message_en ?? "");
  const [linkUrl, setLinkUrl] = useState(announcement?.link_url ?? "");
  const [linkLabelAr, setLinkLabelAr] = useState(
    announcement?.link_label_ar ?? "",
  );
  const [linkLabelEn, setLinkLabelEn] = useState(
    announcement?.link_label_en ?? "",
  );

  const fieldErrors = result && !result.ok ? result.fieldErrors : undefined;
  const formError = result && !result.ok ? result.message : null;

  const preview = localizedAnnouncement(
    {
      id: "preview",
      message_ar: messageAr,
      message_en: messageEn,
      link_url: linkUrl,
      link_label_ar: linkLabelAr,
      link_label_en: linkLabelEn,
      is_active: true,
      starts_at: null,
      ends_at: null,
      display_order: 0,
    },
    locale,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = normalizeSchedule(new FormData(event.currentTarget));

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createAnnouncement(formData)
          : await updateAnnouncement(formData);

      setResult(response);

      if (response.ok) {
        toast({
          title:
            mode === "create"
              ? t("announcements.form.createdToast")
              : t("announcements.form.updatedToast"),
          variant: "success",
        });
        onSuccess();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {mode === "edit" && announcement ? (
        <input type="hidden" name="id" value={announcement.id} />
      ) : null}

      <Field
        id={`${formId}-message-ar`}
        label={t("announcements.form.messageAr")}
        error={fieldErrors?.message_ar}
        required
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message_ar"
            rows={2}
            value={messageAr}
            onChange={(event) => setMessageAr(event.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-message-en`}
        label={t("announcements.form.messageEn")}
        description={t("announcements.form.messageEnHint")}
        error={fieldErrors?.message_en}
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message_en"
            rows={2}
            value={messageEn}
            onChange={(event) => setMessageEn(event.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <Field
        id={`${formId}-link`}
        label={t("announcements.form.link")}
        description={t("announcements.form.linkHint")}
        error={fieldErrors?.link_url}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="link_url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            disabled={isPending}
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${formId}-link-label-ar`}
          label={t("announcements.form.linkLabelAr")}
          error={fieldErrors?.link_label_ar}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="link_label_ar"
              type="text"
              autoComplete="off"
              value={linkLabelAr}
              onChange={(event) => setLinkLabelAr(event.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              disabled={isPending}
            />
          )}
        </Field>

        <Field
          id={`${formId}-link-label-en`}
          label={t("announcements.form.linkLabelEn")}
          error={fieldErrors?.link_label_en}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="link_label_en"
              type="text"
              autoComplete="off"
              value={linkLabelEn}
              onChange={(event) => setLinkLabelEn(event.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              disabled={isPending}
            />
          )}
        </Field>
      </div>

      <div
        className="rounded-md border border-border bg-muted/40 px-3 py-2"
        aria-live="polite"
      >
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t("announcements.form.preview")}
        </p>
        <p className="mt-1 text-sm break-words">
          {preview.message || (
            <span className="text-muted-foreground italic">
              {t("announcements.form.previewEmpty")}
            </span>
          )}
          {preview.linkUrl && preview.linkLabel ? (
            <span className="text-muted-foreground"> — {preview.linkLabel}</span>
          ) : null}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${formId}-starts-at`}
          label={t("announcements.form.startsAt")}
          error={fieldErrors?.starts_at}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="starts_at"
              type="datetime-local"
              defaultValue={toLocalDateTimeInputValue(announcement?.starts_at)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              disabled={isPending}
            />
          )}
        </Field>

        <Field
          id={`${formId}-ends-at`}
          label={t("announcements.form.endsAt")}
          error={fieldErrors?.ends_at}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="ends_at"
              type="datetime-local"
              defaultValue={toLocalDateTimeInputValue(announcement?.ends_at)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              disabled={isPending}
            />
          )}
        </Field>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("announcements.form.scheduleHint")}
      </p>

      <Field
        id={`${formId}-order`}
        label={t("announcements.form.order")}
        description={t("announcements.form.orderHint")}
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
            defaultValue={announcement?.display_order ?? 0}
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
          defaultChecked={announcement?.is_active ?? true}
          disabled={isPending}
          className="size-4 shrink-0 rounded border-border accent-primary"
        />
        <Label htmlFor={`${formId}-active`} className="font-normal">
          {t("announcements.form.activeLabel")}
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
            ? t("announcements.form.create")
            : t("actions.save")}
        </Button>
      </div>
    </form>
  );
}
