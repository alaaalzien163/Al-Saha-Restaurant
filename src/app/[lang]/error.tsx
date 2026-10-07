"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const t = useTranslations("Errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center py-[var(--section-gap)]">
      <Container size="narrow" className="text-center">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("body")}</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>{t("retry")}</Button>
        </div>
      </Container>
    </main>
  );
}
