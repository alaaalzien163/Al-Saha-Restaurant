"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Announcement } from "@/types/domain";
import { AnnouncementForm } from "./announcement-form";

export type AnnouncementFormDialogProps = {
  mode: "create" | "edit";
  announcement?: Announcement;
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
};

/** Trigger button + dialog hosting the reusable AnnouncementForm. */
export function AnnouncementFormDialog({
  mode,
  announcement,
  triggerLabel,
  triggerIcon,
  triggerVariant = "primary",
  triggerSize = "md",
}: AnnouncementFormDialogProps) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        startIcon={triggerIcon}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title={
          mode === "create"
            ? t("announcements.dialog.createTitle")
            : t("announcements.dialog.editTitle")
        }
        description={
          mode === "create"
            ? t("announcements.dialog.createDescription")
            : undefined
        }
      >
        <AnnouncementForm
          mode={mode}
          announcement={announcement}
          onSuccess={close}
          onCancel={close}
        />
      </Dialog>
    </>
  );
}
