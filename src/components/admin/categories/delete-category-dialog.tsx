"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { deleteCategory } from "@/app/[lang]/admin/(dashboard)/categories/actions";
import type { Category } from "@/types/domain";
import { TrashIcon } from "../admin-icons";

export type DeleteCategoryDialogProps = {
  category: Category;
};

/** Delete action with a confirmation dialog. */
export function DeleteCategoryDialog({ category }: DeleteCategoryDialogProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    const formData = new FormData();
    formData.set("id", category.id);

    startTransition(async () => {
      const response = await deleteCategory(formData);
      if (response.ok) {
        toast({ title: t("categories.delete.toast"), variant: "success" });
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
        title={t("categories.delete.title")}
        description={t("categories.delete.confirm", { name: category.name })}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={confirm}
              isLoading={isPending}
            >
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
            {t("categories.delete.note")}
          </p>
        )}
      </Dialog>
    </>
  );
}
