"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Category } from "@/types/domain";
import { CategoryForm } from "./category-form";

export type CategoryFormDialogProps = {
  mode: "create" | "edit";
  category?: Category;
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
};

/** Trigger button + dialog hosting the reusable CategoryForm. */
export function CategoryFormDialog({
  mode,
  category,
  triggerLabel,
  triggerIcon,
  triggerVariant = "primary",
  triggerSize = "md",
}: CategoryFormDialogProps) {
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
        title={
          mode === "create"
            ? t("categories.dialog.createTitle")
            : t("categories.dialog.editTitle")
        }
        description={
          mode === "create" ? t("categories.dialog.createDescription") : undefined
        }
      >
        <CategoryForm
          mode={mode}
          category={category}
          onSuccess={close}
          onCancel={close}
        />
      </Dialog>
    </>
  );
}
