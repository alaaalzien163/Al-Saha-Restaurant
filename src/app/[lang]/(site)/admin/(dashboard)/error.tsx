"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  const t = useTranslations("Admin");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title={t("error.title")}
      description={t("error.body")}
      action={<Button onClick={reset}>{t("error.retry")}</Button>}
    />
  );
}
