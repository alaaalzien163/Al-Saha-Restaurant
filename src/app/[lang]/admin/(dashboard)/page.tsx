import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { AdminPageHeader } from "@/components/admin";

type AdminOverviewPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: AdminOverviewPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("overview.title"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminOverviewPage({
  params,
}: AdminOverviewPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  const user = await requireAdmin();

  return (
    <>
      <AdminPageHeader
        title={t("overview.title")}
        description={t("overview.description")}
      />

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          {t.rich("overview.signedInAs", {
            email: user.email ?? t("overview.fallbackEmail"),
            b: (chunks) => (
              <span className="font-medium text-foreground">{chunks}</span>
            ),
          })}
        </p>
      </div>
    </>
  );
}
