"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  const t = useTranslations("Admin");

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="text-muted-foreground" label={t("loading")} />
    </div>
  );
}
