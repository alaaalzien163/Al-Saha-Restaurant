"use client";

import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import type { PublicCategory } from "@/types/domain";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

export type CategoryNavProps = {
  categories: PublicCategory[];
  /** Currently selected category — driven by the parent so one panel shows. */
  activeId: string;
  onSelect: (categoryId: string) => void;
};

/** DOM id of the tab button for a category. */
export function categoryTabId(categoryId: string): string {
  return `menu-tab-${categoryId}`;
}

/** DOM id of the panel a category's items render into. */
export function categoryPanelId(categoryId: string): string {
  return `menu-panel-${categoryId}`;
}

const SELECTABLE_KEYS = ["ArrowLeft", "ArrowRight", "Home", "End"];

/**
 * Sticky category selector rendered as a WAI-ARIA tab list.
 *
 * Only one category is ever active; the parent owns the selection so switching
 * categories is a local state change with no request. A roving tabindex keeps a
 * single tab in the page tab order, with arrow keys (RTL-aware), Home and End
 * moving between tabs. The row scrolls horizontally so the page never
 * overflows.
 */
export function CategoryNav({
  categories,
  activeId,
  onSelect,
}: CategoryNavProps) {
  const t = useTranslations("Accessibility");

  const selectedIndex = categories.findIndex(
    (category) => category.id === activeId,
  );
  const rovingIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!SELECTABLE_KEYS.includes(event.key)) return;

    const doc = event.currentTarget.ownerDocument;
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        'button[role="tab"]',
      ),
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((tab) => tab === doc.activeElement);
    if (currentIndex === -1) return;

    const isRtl = doc.documentElement.dir === "rtl";
    let nextIndex: number;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else if (event.key === "ArrowRight") {
      nextIndex = isRtl ? currentIndex - 1 : currentIndex + 1;
    } else {
      nextIndex = isRtl ? currentIndex + 1 : currentIndex - 1;
    }

    if (nextIndex < 0) nextIndex = tabs.length - 1;
    else if (nextIndex >= tabs.length) nextIndex = 0;

    const nextTab = tabs[nextIndex];
    const nextCategory = categories[nextIndex];
    if (!nextTab || !nextCategory) return;

    event.preventDefault();

    nextTab.focus();
    nextTab.scrollIntoView({ block: "nearest", inline: "nearest" });
    onSelect(nextCategory.id);
  };

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div
          role="tablist"
          aria-label={t("menuCategories")}
          onKeyDown={handleKeyDown}
          className="flex gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category, index) => {
            const isActive = category.id === activeId;

            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                id={categoryTabId(category.id)}
                aria-selected={isActive}
                aria-controls={categoryPanelId(category.id)}
                tabIndex={index === rovingIndex ? 0 : -1}
                onClick={() => onSelect(category.id)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground",
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
