"use client";

import type { MenuItem } from "@/types/domain";
import { useTranslations } from "next-intl";
import { PencilIcon } from "../admin-icons";
import type { CategoryOption } from "./item-form";
import { ItemFormDialog } from "./item-form-dialog";
import { DeleteItemDialog } from "./delete-item-dialog";
import { ToggleItemButton } from "./toggle-item-button";

export type ItemRowActionsProps = {
  item: MenuItem;
  categories: CategoryOption[];
};

/** All per-row actions for an item, grouped for table and card reuse. */
export function ItemRowActions({ item, categories }: ItemRowActionsProps) {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <ToggleItemButton item={item} />
      <ItemFormDialog
        mode="edit"
        item={item}
        categories={categories}
        triggerLabel={t("actions.edit")}
        triggerIcon={<PencilIcon className="size-4" />}
        triggerVariant="outline"
        triggerSize="sm"
      />
      <DeleteItemDialog item={item} />
    </div>
  );
}
