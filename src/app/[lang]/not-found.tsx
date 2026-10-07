"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <main className="flex flex-1 items-center py-[var(--section-gap)]">
      <Container size="narrow" className="text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-2 text-2xl font-semibold">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("notFoundBody")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md px-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("backToHome")}
        </Link>
      </Container>
    </main>
  );
}
