import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminAnnouncements } from "@/lib/data/announcements";
import { AdminPageHeader } from "@/components/admin";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AnnouncementFormDialog,
  AnnouncementsView,
} from "@/components/admin/announcements";
import { PlusIcon } from "@/components/admin/admin-icons";

type AdminAnnouncementsPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: AdminAnnouncementsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("announcements.title"),
    robots: { index: false, follow: false },
  };
}

function AddAnnouncementButton({ label }: { label: string }) {
  return (
    <AnnouncementFormDialog
      mode="create"
      triggerLabel={label}
      triggerIcon={<PlusIcon className="size-4" />}
    />
  );
}

export default async function AdminAnnouncementsPage({
  params,
}: AdminAnnouncementsPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  await requireAdmin();
  const announcements = await getAdminAnnouncements();

  return (
    <>
      <AdminPageHeader
        title={t("announcements.title")}
        description={t("announcements.description")}
        action={<AddAnnouncementButton label={t("announcements.add")} />}
      />

      {announcements.length === 0 ? (
        <EmptyState
          title={t("announcements.emptyTitle")}
          description={t("announcements.emptyDescription")}
          action={<AddAnnouncementButton label={t("announcements.add")} />}
        />
      ) : (
        <AnnouncementsView announcements={announcements} />
      )}
    </>
  );
}
