import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getProfile } from "@/lib/data/profiles";
import { AdminPageHeader } from "@/components/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordForm, ProfileForm } from "@/components/admin/profile";

type AdminProfilePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: AdminProfilePageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("profile.title"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminProfilePage({
  params,
}: AdminProfilePageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  const user = await requireAdmin();
  const profile = await getProfile(user.id);

  return (
    <>
      <AdminPageHeader
        title={t("profile.title")}
        description={t("profile.description")}
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card>
          <CardHeader>
            <CardTitle as="h2">{t("profile.detailsTitle")}</CardTitle>
            <CardDescription>
              {t("profile.detailsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} email={user.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h2">{t("profile.passwordTitle")}</CardTitle>
            <CardDescription>
              {t("profile.passwordDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
