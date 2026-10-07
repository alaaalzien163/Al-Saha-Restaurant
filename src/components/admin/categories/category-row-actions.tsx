"use client";

import type { Category } from "@/types/domain";
import { useTranslations } from "next-intl";
import { PencilIcon } from "../admin-icons";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { ToggleCategoryButton } from "./toggle-category-button";

export type CategoryRowActionsProps = {
  category: Category;
};

/** All per-row actions for a category, grouped for reuse in table and cards. */
export function CategoryRowActions({ category }: CategoryRowActionsProps) {
  const t = useTranslations("Admin");

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <ToggleCategoryButton category={category} />
      <CategoryFormDialog
        mode="edit"
        category={category}
        triggerLabel={t("actions.edit")}
        triggerIcon={<PencilIcon className="size-4" />}
        triggerVariant="outline"
        triggerSize="sm"
      />
      <DeleteCategoryDialog category={category} />
    </div>
  );
}
