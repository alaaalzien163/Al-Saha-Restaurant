"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type {
  AdminItemsAvailability,
  AdminItemsSort,
} from "@/lib/data/items";
import {
  adminItemsHref,
  DEFAULT_ITEM_AVAILABILITY,
  DEFAULT_ITEM_SORT,
  hasAdminItemFilters,
} from "@/lib/utils/admin-item-filters";

export type AdminItemsToolbarCategory = {
  id: string;
  name: string;
};

export type AdminItemsToolbarProps = {
  /** Admin item list path, without query string. */
  basePath: string;
  categories: AdminItemsToolbarCategory[];
  initialQuery: string;
  initialCategory: string;
  initialAvailability: AdminItemsAvailability;
  initialSort: AdminItemsSort;
  /** Localised "N matching items" label, computed on the server. */
  resultLabel: string;
};

const SEARCH_DEBOUNCE_MS = 300;

/**
 * Search + filters for the admin item list.
 *
 * Search input changes are debounced, then written to the URL with
 * `router.replace`, so filtering and pagination stay server-side. Selects
 * navigate immediately. Every change resets `page` so the user never lands on
 * an out-of-range page after narrowing the results.
 */
export function AdminItemsToolbar({
  basePath,
  categories,
  initialQuery,
  initialCategory,
  initialAvailability,
  initialSort,
  resultLabel,
}: AdminItemsToolbarProps) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const searchId = useId();
  const categoryId = useId();
  const availabilityId = useId();
  const sortId = useId();

  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] =
    useState<AdminItemsAvailability>(initialAvailability);
  const [sort, setSort] = useState<AdminItemsSort>(initialSort);
  const [isPending, startTransition] = useTransition();
  const lastNavigated = useRef(initialQuery);

  const values = { q: search, category, availability, sort };
  const filtersActive = hasAdminItemFilters(values);

  function navigate(nextValues: typeof values) {
    lastNavigated.current = nextValues.q.trim();
    startTransition(() => {
      router.replace(adminItemsHref(basePath, nextValues), { scroll: false });
    });
  }

  // Debounce only the free-text field; the selects navigate on change.
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed === lastNavigated.current) return;

    const timer = setTimeout(() => {
      navigate({ q: trimmed, category, availability, sort });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // `navigate` only reads the current values; the fields are listed instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, availability, sort, basePath]);

  function changeCategory(nextCategory: string) {
    setCategory(nextCategory);
    navigate({ q: search, category: nextCategory, availability, sort });
  }

  function changeAvailability(nextAvailability: AdminItemsAvailability) {
    setAvailability(nextAvailability);
    navigate({ q: search, category, availability: nextAvailability, sort });
  }

  function changeSort(nextSort: AdminItemsSort) {
    setSort(nextSort);
    navigate({ q: search, category, availability, sort: nextSort });
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setAvailability(DEFAULT_ITEM_AVAILABILITY);
    setSort(DEFAULT_ITEM_SORT);
    lastNavigated.current = "";
    startTransition(() => {
      router.replace(basePath, { scroll: false });
    });
  }

  return (
    <section className="mb-5 space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div role="search">
        <Label htmlFor={searchId}>{t("items.searchLabel")}</Label>
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("items.searchPlaceholder")}
            autoComplete="off"
            enterKeyHint="search"
            className="ps-9 pe-10"
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                navigate({
                  q: "",
                  category,
                  availability,
                  sort,
                });
              }}
              aria-label={t("items.clearSearch")}
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

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor={categoryId}>
            {t("items.filter.categoryLabel")}
          </Label>
          <Select
            id={categoryId}
            value={category}
            onChange={(event) => changeCategory(event.target.value)}
            className="mt-1.5"
          >
            <option value="">{t("items.filter.allCategories")}</option>
            {categories.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor={availabilityId}>
            {t("items.filter.availabilityLabel")}
          </Label>
          <Select
            id={availabilityId}
            value={availability}
            onChange={(event) =>
              changeAvailability(event.target.value as AdminItemsAvailability)
            }
            className="mt-1.5"
          >
            <option value="all">{t("items.filter.availabilityAll")}</option>
            <option value="available">
              {t("items.filter.availabilityAvailable")}
            </option>
            <option value="unavailable">
              {t("items.filter.availabilityUnavailable")}
            </option>
          </Select>
        </div>

        <div>
          <Label htmlFor={sortId}>{t("items.filter.sortLabel")}</Label>
          <Select
            id={sortId}
            value={sort}
            onChange={(event) =>
              changeSort(event.target.value as AdminItemsSort)
            }
            className="mt-1.5"
          >
            <option value="order">{t("items.filter.sortOrder")}</option>
            <option value="name">{t("items.filter.sortName")}</option>
            <option value="price_asc">
              {t("items.filter.sortPriceAsc")}
            </option>
            <option value="price_desc">
              {t("items.filter.sortPriceDesc")}
            </option>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          {isPending ? <Spinner className="size-3.5" /> : null}
          {resultLabel}
        </p>

        {filtersActive ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            {t("items.filter.clear")}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
