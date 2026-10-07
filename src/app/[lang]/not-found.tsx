import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";

/**
 * Localised 404 for `app/[lang]`.
 *
 * Server Component on purpose: the status code, heading, body and home link all
 * have to be present in the initial HTML, so an unknown URL renders a real 404
 * document instead of a loading shell. Copy comes from the existing `Errors`
 * catalog for both locales, and `Link` resolves the locale prefix (and
 * direction) automatically.
 */
export default async function NotFound() {
  const t = await getTranslations("Errors");

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
