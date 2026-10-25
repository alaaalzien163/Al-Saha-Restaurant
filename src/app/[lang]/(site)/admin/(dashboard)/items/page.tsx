import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminCategories } from "@/lib/data/categories";
import {
  ADMIN_ITEMS_PAGE_SIZE,
  getAdminItemsPage,
  type AdminItemsAvailability,
  type AdminItemsSort,
} from "@/lib/data/items";
import { adminItemFilterParams } from "@/lib/utils/admin-item-filters";
import { AdminPageHeader } from "@/components/admin";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon } from "@/components/admin/admin-icons";
import {
  AdminItemsLoading,
  AdminItemsToolbar,
  ItemFormDialog,
  ItemsPagination,
  ItemsView,
  type CategoryOption,
} from "@/components/admin/items";

type AdminItemsSearchParams = Record<
  string,
  string | string[] | undefined
>;

type AdminItemsPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<AdminItemsSearchParams>;
};

const AVAILABILITY_VALUES: readonly AdminItemsAvailability[] = [
  "all",
  "available",
  "unavailable",
];
const SORT_VALUES: readonly AdminItemsSort[] = [
  "order",
  "name",
  "price_asc",
  "price_desc",
];

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseAvailability(value: string): AdminItemsAvailability {
  return AVAILABILITY_VALUES.includes(value as AdminItemsAvailability)
    ? (value as AdminItemsAvailability)
    : "all";
}

function parseSort(value: string): AdminItemsSort {
  return SORT_VALUES.includes(value as AdminItemsSort)
    ? (value as AdminItemsSort)
    : "order";
}

function parsePage(value: string): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata({
  params,
}: AdminItemsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("items.title"),
    robots: { index: false, follow: false },
  };
}

/**
 * Admin Items page shell.
 *
 * Only the route params and translations are read here, so the static shell can
 * prerender the heading and the loading skeleton. `searchParams` is URL data and
 * must not be touched during prerendering, so it is passed as a promise into
 * `AdminItemsContent` behind `<Suspense>`, where it streams in per request.
 */
export default async function AdminItemsPage({
  params,
  searchParams,
}: AdminItemsPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return (
    <Suspense fallback={<AdminItemsLoading label={t("loading")} />}>
      <AdminItemsContent lang={lang} searchParams={searchParams} />
    </Suspense>
  );
}

/**
 * Request-time part of the page.
 *
 * Runs inside the `<Suspense>` boundary above: it authorizes the admin first,
 * then reads the URL filters and the protected menu rows. Both the session read
 * and the data queries stay in private, request-scoped caches.
 */
async function AdminItemsContent({
  lang,
  searchParams,
}: {
  lang: string;
  searchParams: Promise<AdminItemsSearchParams>;
}) {
  await requireAdmin();

  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  const [rawParams, categories] = await Promise.all([
    searchParams,
    getAdminCategories(),
  ]);

  const search = firstValue(rawParams.q).trim();
  const requestedCategory = firstValue(rawParams.category);
  const categoryId = categories.some((c) => c.id === requestedCategory)
    ? requestedCategory
    : "";
  const availability = parseAvailability(firstValue(rawParams.availability));
  const sort = parseSort(firstValue(rawParams.sort));
  const page = parsePage(firstValue(rawParams.page));

  const result = await getAdminItemsPage({
    categoryId: categoryId || undefined,
    search,
    availability,
    sort,
    page,
    pageSize: ADMIN_ITEMS_PAGE_SIZE,
  });

  const categoryOptions: CategoryOption[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
  }));
  const hasCategories = categoryOptions.length > 0;
  const filtersActive =
    Object.keys(
      adminItemFilterParams({
        q: search,
        category: categoryId,
        availability,
        sort,
      }),
    ).length > 0;

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
          <AdminItemsToolbar
            basePath="/admin/items"
            categories={categoryOptions}
            initialQuery={search}
            initialCategory={categoryId}
            initialAvailability={availability}
            initialSort={sort}
            resultLabel={t("items.matchCount", { count: result.total })}
          />

          {result.total === 0 ? (
            <EmptyState
              title={
                filtersActive
                  ? t("items.emptySearchTitle")
                  : t("items.emptyTitle")
              }
              description={
                filtersActive
                  ? t("items.emptySearchDescription")
                  : t("items.emptyDescription")
              }
              action={filtersActive ? undefined : addButton}
            />
          ) : (
            <>
              <ItemsView items={result.items} categories={categoryOptions} />
              <ItemsPagination
                basePath="/admin/items"
                params={adminItemFilterParams({
                  q: search,
                  category: categoryId,
                  availability,
                  sort,
                })}
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
