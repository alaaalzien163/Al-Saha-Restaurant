"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import type { MenuSection, PublicMenuItem } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Heading, Text } from "@/components/ui/typography";
import {
  matchesNormalizedText,
  normalizeSearchText,
} from "@/lib/utils/search";
import {
  ALL_CATEGORIES_ID,
  categoryPanelId,
  categoryTabId,
  CategoryNav,
} from "./category-nav";
import { MenuItemCard } from "./menu-item-card";

/** Matches the 2 / 3 / 4 column breakpoints of the items grid. */
const ITEM_IMAGE_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw";

type MenuSort = "default" | "price_asc" | "price_desc";

const SORT_OPTIONS: MenuSort[] = ["default", "price_asc", "price_desc"];

function sortItems(items: PublicMenuItem[], sort: MenuSort): PublicMenuItem[] {
  if (sort === "default") return items;

  const direction = sort === "price_asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    // Items without a price always come last, so a null never breaks the sort.
    if (a.price === null && b.price === null) {
      return a.display_order - b.display_order;
    }
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return (a.price - b.price) * direction;
  });
}

function matchesQuery(item: PublicMenuItem, normalizedQuery: string): boolean {
  if (!normalizedQuery) return true;
  return (
    matchesNormalizedText(item.name, normalizedQuery) ||
    matchesNormalizedText(item.description, normalizedQuery)
  );
}

export type MenuBrowserProps = {
  sections: MenuSection[];
};

/**
 * Menu browser for the restaurant.
 *
 * The server fetches every active category and its available items once and
 * passes them here; this client island filters, sorts and switches categories
 * locally, so typing in the search box never triggers a request or navigation.
 * "All" is selected by default (the whole menu is searchable at once), and the
 * search text is preserved when switching categories.
 */
export function MenuBrowser({ sections }: MenuBrowserProps) {
  const t = useTranslations("Menu");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const searchId = useId();
  const sortId = useId();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [sort, setSort] = useState<MenuSort>("default");
  const [activeCategoryId, setActiveCategoryId] = useState(ALL_CATEGORIES_ID);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const normalizedQuery = normalizeSearchText(deferredQuery);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    // Only re-position when the freshly selected category would otherwise be
    // hidden behind the sticky header/tab bar (e.g. after scrolling deep into
    // a long list). Arrow-key selection near the top of the page stays put.
    const stickyNav = panel.parentElement?.previousElementSibling;
    const stickyBottom = stickyNav
      ? stickyNav.getBoundingClientRect().bottom
      : 112;
    if (panel.getBoundingClientRect().top >= stickyBottom - 1) return;

    const reduceMotion = panel
      .closest("html")
      ?.matches("(prefers-reduced-motion: reduce)");
    panel.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeCategoryId]);

  const tabs = [
    { id: ALL_CATEGORIES_ID, name: t("allCategories") },
    ...sections.map((section) => ({
      id: section.category.id,
      name: section.category.name,
    })),
  ];

  const isAllCategories = activeCategoryId === ALL_CATEGORIES_ID;
  const scopedSections = isAllCategories
    ? sections
    : sections.filter((section) => section.category.id === activeCategoryId);

  const visibleSections = scopedSections
    .map((section) => ({
      category: section.category,
      items: sortItems(
        section.items.filter((item) => matchesQuery(item, normalizedQuery)),
        sort,
      ),
    }))
    .filter((section) =>
      normalizedQuery ? section.items.length > 0 : true,
    );

  const scopeTotal = scopedSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );
  const matchCount = visibleSections.reduce(
    (total, section) => total + section.items.length,
    0,
  );
  const hasQuery = normalizedQuery.length > 0;
  const hasResults = matchCount > 0;

  if (sections.length === 0) return null;

  return (
    <>
      <Container className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor={searchId}>{t("searchLabel")}</Label>
            <div className="relative mt-1.5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <Input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                enterKeyHint="search"
                className="ps-9 pe-10"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={t("clearSearch")}
                  className="absolute inset-y-0 end-1 my-auto grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="size-4"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <div className="sm:w-56">
            <Label htmlFor={sortId}>{t("sortLabel")}</Label>
            <Select
              id={sortId}
              value={sort}
              onChange={(event) => setSort(event.target.value as MenuSort)}
              className="mt-1.5"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "default"
                    ? t("sortDefault")
                    : option === "price_asc"
                      ? t("sortPriceAsc")
                      : t("sortPriceDesc")}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-muted-foreground"
        >
          {hasQuery
            ? t("resultsFiltered", {
                shown: matchCount,
                total: scopeTotal,
              })
            : t("resultsCount", { count: scopeTotal })}
        </p>
      </Container>

      <CategoryNav
        categories={tabs}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      <Container className="py-[var(--section-gap)]">
        <div
          ref={panelRef}
          role="tabpanel"
          id={categoryPanelId(activeCategoryId)}
          aria-labelledby={categoryTabId(activeCategoryId)}
          tabIndex={0}
          className="scroll-mt-36 space-y-10"
        >
          {hasQuery && !hasResults ? (
            <EmptyState
              title={t("noResultsTitle")}
              description={t("noResultsDescription")}
              action={
                <Button variant="outline" onClick={() => setQuery("")}>
                  {t("clearFilters")}
                </Button>
              }
            />
          ) : (
            visibleSections.map((section) => (
              <section
                key={section.category.id}
                aria-labelledby={`menu-heading-${section.category.id}`}
              >
                <div className="max-w-prose">
                  <Heading
                    as="h2"
                    size="lg"
                    id={`menu-heading-${section.category.id}`}
                  >
                    {section.category.name}
                  </Heading>
                  {section.category.description ? (
                    <Text tone="muted" className="mt-2 text-pretty">
                      {section.category.description}
                    </Text>
                  ) : null}
                </div>

                {section.items.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 xl:gap-4">
                    {section.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        locale={locale}
                        priceUnavailableLabel={tCommon("priceUnavailable")}
                        sizes={ITEM_IMAGE_SIZES}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    className="mt-4 sm:mt-6"
                    title={t("emptyCategoryTitle")}
                    description={t("emptyCategoryDescription")}
                  />
                )}
              </section>
            ))
          )}
        </div>
      </Container>
    </>
  );
}
