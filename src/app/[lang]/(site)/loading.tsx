"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Spinner } from "@/components/ui/spinner";

// A client component on purpose: the Suspense fallback is rendered outside the
// root layout's `setRequestLocale` scope, so a server-side `useTranslations`
// would read `headers()` and block static prerendering.
export default function Loading() {
  const t = useTranslations("Common");

  return (
    <div className="flex flex-1 items-center justify-center py-[var(--section-gap)]">
      <Container className="flex justify-center">
        <Spinner className="text-muted-foreground" label={t("loadingPage")} />
      </Container>
    </div>
  );
}
