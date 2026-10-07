"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { deleteItem } from "@/app/[lang]/(site)/admin/(dashboard)/items/actions";
import type { MenuItem } from "@/types/domain";
import { TrashIcon } from "../admin-icons";

export type DeleteItemDialogProps = {
  item: MenuItem;
};

/** Delete action with confirmation. The item image is removed server-side. */
export function DeleteItemDialog({ item }: DeleteItemDialogProps) {
  const t = useTranslations("Admin");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    const formData = new FormData();
    formData.set("id", item.id);

    startTransition(async () => {
      const response = await deleteItem(formData);
      if (response.ok) {
        toast({ title: t("items.delete.toast"), variant: "success" });
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
        title={t("items.delete.title")}
        description={t("items.delete.confirm", { name: item.name })}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              {t("actions.cancel")}
            </Button>
            <Button variant="danger" onClick={confirm} isLoading={isPending}>
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
            {t("items.delete.note")}
          </p>
        )}
      </Dialog>
    </>
  );
}
