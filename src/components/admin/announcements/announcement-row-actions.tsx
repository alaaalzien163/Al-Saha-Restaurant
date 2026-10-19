"use client";

import { useTranslations } from "next-intl";
import type { Announcement } from "@/types/domain";
import { PencilIcon } from "../admin-icons";
import { AnnouncementFormDialog } from "./announcement-form-dialog";
import { DeleteAnnouncementDialog } from "./delete-announcement-dialog";
import { ToggleAnnouncementButton } from "./toggle-announcement-button";

export type AnnouncementRowActionsProps = {
  announcement: Announcement;
};

/** All per-row actions for an announcement, grouped for table and card reuse. */
export function AnnouncementRowActions({
  announcement,
}: AnnouncementRowActionsProps) {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <ToggleAnnouncementButton announcement={announcement} />
      <AnnouncementFormDialog
        mode="edit"
        announcement={announcement}
        triggerLabel={t("actions.edit")}
        triggerIcon={<PencilIcon className="size-4" />}
        triggerVariant="outline"
        triggerSize="sm"
      />
      <DeleteAnnouncementDialog announcement={announcement} />
    </div>
  );
}
