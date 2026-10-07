import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { PublicMenuItem } from "@/types/domain";

export type MenuItemCardProps = {
  item: PublicMenuItem;
  /** Locale used to format the price ("en" / "ar"). */
  locale: string;
  /** Translated fallback shown when the item has no stored price. */
  priceUnavailableLabel: string;
  /** `next/image` sizes hint; defaults to a single-column layout. */
  sizes?: string;
};

const DEFAULT_SIZES = "(min-width: 640px) 33vw, 50vw";

function ImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center text-muted-foreground/60"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7 sm:size-8"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

/** A single menu item. Server Component — no client JavaScript. */
export function MenuItemCard({
  item,
  locale,
  priceUnavailableLabel,
  sizes = DEFAULT_SIZES,
}: MenuItemCardProps) {
  const price = formatPrice(item.price, locale);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/9] bg-muted sm:aspect-[3/2]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-2 sm:gap-1 sm:p-3">
        <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground text-pretty">
          {item.name}
        </h3>

        {item.description ? (
          <p className="line-clamp-2 text-muted-foreground text-pretty text-xs leading-snug">
            {item.description}
          </p>
        ) : null}

        <p
          className={cn(
            "mt-auto pt-1 text-sm",
            price
              ? "font-semibold tabular-nums text-foreground"
              : "font-medium text-muted-foreground",
          )}
        >
          {price ?? priceUnavailableLabel}
        </p>
      </div>
    </article>
  );
}
