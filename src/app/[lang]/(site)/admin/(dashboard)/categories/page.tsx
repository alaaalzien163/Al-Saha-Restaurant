import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCategories } from "@/lib/data/categories";
import { AdminPageHeader } from "@/components/admin";
import { EmptyState } from "@/components/ui/empty-state";
import {
  CategoriesView,
  CategoryFormDialog,
} from "@/components/admin/categories";
import { PlusIcon } from "@/components/admin/admin-icons";

type AdminCategoriesPageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: AdminCategoriesPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("categories.title"),
    robots: { index: false, follow: false },
  };
}

function AddCategoryButton({ label }: { label: string }) {
  return (
    <CategoryFormDialog
      mode="create"
      triggerLabel={label}
      triggerIcon={<PlusIcon className="size-4" />}
    />
  );
}

export default async function AdminCategoriesPage({
  params,
}: AdminCategoriesPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  await requireAdmin();
  const categories = await getAdminCategories();

  return (
    <>
      <AdminPageHeader
        title={t("categories.title")}
        description={t("categories.description")}
        action={<AddCategoryButton label={t("categories.add")} />}
      />

      {categories.length === 0 ? (
        <EmptyState
          title={t("categories.emptyTitle")}
          description={t("categories.emptyDescription")}
          action={<AddCategoryButton label={t("categories.add")} />}
        />
      ) : (
        <CategoriesView categories={categories} />
      )}
    </>
  );
}
