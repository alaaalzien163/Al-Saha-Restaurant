"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { toggleAnnouncement } from "@/app/[lang]/(site)/admin/(dashboard)/announcements/actions";
import type { Announcement } from "@/types/domain";

export type ToggleAnnouncementButtonProps = {
  announcement: Announcement;
};

/** Quickly flip an announcement's active state. */
export function ToggleAnnouncementButton({
  announcement,
}: ToggleAnnouncementButtonProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const nextActive = !announcement.is_active;

  function toggle() {
    const formData = new FormData();
    formData.set("id", announcement.id);
    formData.set("is_active", String(nextActive));

    startTransition(async () => {
      const response = await toggleAnnouncement(formData);
      if (response.ok) {
        toast({
          title: nextActive
            ? t("announcements.toggle.activatedToast")
            : t("announcements.toggle.deactivatedToast"),
          variant: "success",
        });
      } else {
        toast({ title: response.message, variant: "danger" });
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      isLoading={isPending}
    >
      {nextActive ? t("status.activate") : t("status.deactivate")}
    </Button>
  );
}
