"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { deleteAnnouncement } from "@/app/[lang]/(site)/admin/(dashboard)/announcements/actions";
import type { Announcement } from "@/types/domain";
import { TrashIcon } from "../admin-icons";

export type DeleteAnnouncementDialogProps = {
  announcement: Announcement;
};

/** Delete action with a confirmation dialog. */
export function DeleteAnnouncementDialog({
  announcement,
}: DeleteAnnouncementDialogProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    const formData = new FormData();
    formData.set("id", announcement.id);

    startTransition(async () => {
      const response = await deleteAnnouncement(formData);
      if (response.ok) {
        toast({ title: t("announcements.delete.toast"), variant: "success" });
        setOpen(false);
      } else {
        setError(response.message);
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="dangerOutline"
        size="sm"
        startIcon={<TrashIcon className="size-4" />}
        onClick={() => setOpen(true)}
      >
        {t("actions.delete")}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={t("announcements.delete.title")}
        description={t("announcements.delete.confirm", {
          message: announcement.message_ar,
        })}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("actions.cancel")}
            </Button>
            <Button variant="danger" onClick={confirm} isLoading={isPending}>
              {t("actions.delete")}
            </Button>
          </>
        }
      >
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("announcements.delete.note")}
          </p>
        )}
      </Dialog>
    </>
  );
}
