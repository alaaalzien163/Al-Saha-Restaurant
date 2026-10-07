import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import type { MenuItem } from "@/types/domain";
import type { CategoryOption } from "./item-form";
import { ItemRowActions } from "./item-row-actions";

export type ItemsViewProps = {
  items: MenuItem[];
  categories: CategoryOption[];
};

function StatusBadge({
  available,
  availableLabel,
  unavailableLabel,
}: {
  available: boolean;
  availableLabel: string;
  unavailableLabel: string;
}) {
  return (
    <Badge variant={available ? "success" : "secondary"}>
      {available ? availableLabel : unavailableLabel}
    </Badge>
  );
}

/** Decorative thumbnail (the item name is always shown next to it). */
function Thumbnail({
  item,
  size,
  sizes,
}: {
  item: MenuItem;
  size: string;
  sizes: string;
}) {
  return (
    <div
      className={`relative ${size} shrink-0 overflow-hidden rounded-md border border-border bg-muted`}
    >
      {item.image_url ? (
        <Image
          src={item.image_url}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-full w-full place-items-center text-muted-foreground/60"
        >
          &mdash;
        </span>
      )}
    </div>
  );
}

/** Responsive items view: table on desktop, stacked cards on mobile. */
export async function ItemsView({ items, categories }: ItemsViewProps) {
  const [locale, t, tCommon] = await Promise.all([
    getLocale(),
    getTranslations("Admin"),
    getTranslations("Common"),
  ]);
  const availableLabel = t("status.available");
  const unavailableLabel = t("status.unavailable");
  const uncategorised = t("items.uncategorised");
  const unavailablePriceLabel = tCommon("priceUnavailable");
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <>
      {/* Desktop table. `overflow-x-auto` keeps every cell reachable if the
          sidebar leaves less room than the columns need at 1024px. */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-sm lg:block">
        <table className="w-full text-start text-sm">
          <caption className="sr-only">{t("items.caption")}</caption>
          <thead className="border-b border-border bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.order")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.item")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.category")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.price")}
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                {t("table.status")}
              </th>
              <th scope="col" className="px-4 py-3 text-end font-medium">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border align-top last:border-0"
              >
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {item.display_order}
                </td>
                <th scope="row" className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-3">
                    <Thumbnail item={item} size="size-12" sizes="48px" />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                </th>
                <td className="px-4 py-3 text-muted-foreground">
                  {nameById.get(item.category_id) ?? (
                    <span aria-hidden="true">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums text-foreground">
                  {formatPrice(item.price, locale) ?? unavailablePriceLabel}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    available={item.is_available}
                    availableLabel={availableLabel}
                    unavailableLabel={unavailableLabel}
                  />
                </td>
                <td className="px-4 py-3">
                  <ItemRowActions item={item} categories={categories} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <ul className="space-y-3 lg:hidden">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <Thumbnail item={item} size="size-16" sizes="64px" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium text-foreground text-pretty">
                    {item.name}
                  </h2>
                  <StatusBadge
                    available={item.is_available}
                    availableLabel={availableLabel}
                    unavailableLabel={unavailableLabel}
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("items.mobileMeta", {
                    category:
                      nameById.get(item.category_id) ?? uncategorised,
                    order: item.display_order,
                  })}
                </p>
                <p className="mt-1 font-medium tabular-nums text-foreground">
                  {formatPrice(item.price, locale) ?? unavailablePriceLabel}
                </p>
              </div>
            </div>

            {item.description ? (
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                {item.description}
              </p>
            ) : null}

            <div className="mt-3 border-t border-border pt-3">
              <ItemRowActions item={item} categories={categories} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
