"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export type MenuErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MenuError({ error, reset }: MenuErrorProps) {
  const t = useTranslations("Menu");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-[var(--section-gap)]">
      <ErrorState
        title={t("errorTitle")}
        description={t("errorDescription")}
        action={<Button onClick={reset}>{t("retry")}</Button>}
      />
    </Container>
  );
}
