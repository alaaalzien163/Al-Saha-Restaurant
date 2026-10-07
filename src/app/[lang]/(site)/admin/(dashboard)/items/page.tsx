import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCategories } from "@/lib/data/categories";
import { getAdminItems } from "@/lib/data/items";
import { AdminPageHeader } from "@/components/admin";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon } from "@/components/admin/admin-icons";
import {
  ItemCategoryFilter,
  ItemFormDialog,
  ItemsView,
  type CategoryOption,
} from "@/components/admin/items";

type AdminItemsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("items.title"),
    robots: { index: false, follow: false },
  };
}

export default async function AdminItemsPage({
  params,
  searchParams,
}: AdminItemsPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  await requireAdmin();

  const { category } = await searchParams;

  const [categories, items] = await Promise.all([
    getAdminCategories(),
    getAdminItems(category),
  ]);

  const categoryOptions: CategoryOption[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const hasCategories = categoryOptions.length > 0;

  const addButton = (
    <ItemFormDialog
      mode="create"
      categories={categoryOptions}
      triggerLabel={t("items.add")}
      triggerIcon={<PlusIcon className="size-4" />}
      triggerDisabled={!hasCategories}
    />
  );

  return (
    <>
      <AdminPageHeader
        title={t("items.title")}
        description={t("items.description")}
        action={addButton}
      />

      {!hasCategories ? (
        <EmptyState
          title={t("items.noCategoryTitle")}
          description={t("items.noCategoryDescription")}
          action={
            <ButtonLink href="/admin/categories">
              {t("items.goToCategories")}
            </ButtonLink>
          }
        />
      ) : (
        <>
          {categoryOptions.length > 1 || category ? (
            <ItemCategoryFilter
              categories={categoryOptions}
              activeCategoryId={category}
            />
          ) : null}

          {items.length === 0 ? (
            <EmptyState
              title={t("items.emptyTitle")}
              description={
                category
                  ? t("items.emptyFilteredDescription")
                  : t("items.emptyDescription")
              }
              action={addButton}
            />
          ) : (
            <ItemsView items={items} categories={categoryOptions} />
          )}
        </>
      )}
    </>
  );
}
