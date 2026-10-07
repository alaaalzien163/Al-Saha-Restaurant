"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { toggleItemAvailability } from "@/app/[lang]/(site)/admin/(dashboard)/items/actions";
import type { MenuItem } from "@/types/domain";

export type ToggleItemButtonProps = {
  item: MenuItem;
};

/** Quickly flip an item's availability. */
export function ToggleItemButton({ item }: ToggleItemButtonProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const nextAvailable = !item.is_available;

  function toggle() {
    const formData = new FormData();
    formData.set("id", item.id);
    formData.set("is_available", String(nextAvailable));

    startTransition(async () => {
      const response = await toggleItemAvailability(formData);
      if (response.ok) {
        toast({
          title: nextAvailable
            ? t("items.toggle.availableToast")
            : t("items.toggle.unavailableToast"),
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
      {nextAvailable
        ? t("status.markAvailable")
        : t("status.markUnavailable")}
    </Button>
  );
}
