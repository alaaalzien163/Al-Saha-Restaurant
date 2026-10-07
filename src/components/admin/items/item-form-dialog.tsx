"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { MenuItem } from "@/types/domain";
import { ItemForm, type CategoryOption } from "./item-form";

export type ItemFormDialogProps = {
  mode: "create" | "edit";
  item?: MenuItem;
  categories: CategoryOption[];
  triggerLabel: string;
  triggerIcon?: ReactNode;
  triggerVariant?: ButtonVariant;
  triggerSize?: ButtonSize;
  triggerDisabled?: boolean;
};

/** Trigger + wide dialog hosting the reusable ItemForm. */
export function ItemFormDialog({
  mode,
  item,
  categories,
  triggerLabel,
  triggerIcon,
  triggerVariant = "primary",
  triggerSize = "md",
  triggerDisabled = false,
}: ItemFormDialogProps) {
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
        disabled={triggerDisabled}
      >
        {triggerLabel}
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title={
          mode === "create" ? t("items.dialog.createTitle") : t("items.dialog.editTitle")
        }
        description={
          mode === "create" ? t("items.dialog.createDescription") : undefined
        }
      >
        <ItemForm
          mode={mode}
          item={item}
          categories={categories}
          onSuccess={close}
          onCancel={close}
        />
      </Dialog>
    </>
  );
}
