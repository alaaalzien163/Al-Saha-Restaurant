"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { toggleCategory } from "@/app/[lang]/admin/(dashboard)/categories/actions";
import type { Category } from "@/types/domain";

export type ToggleCategoryButtonProps = {
  category: Category;
};

/** Quickly flip a category's active state. */
export function ToggleCategoryButton({ category }: ToggleCategoryButtonProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const nextActive = !category.is_active;

  function toggle() {
    const formData = new FormData();
    formData.set("id", category.id);
    formData.set("is_active", String(nextActive));

    startTransition(async () => {
      const response = await toggleCategory(formData);
      if (response.ok) {
        toast({
          title: nextActive
            ? t("categories.toggle.activatedToast")
            : t("categories.toggle.deactivatedToast"),
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
