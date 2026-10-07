"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { MenuSection } from "@/types/domain";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading, Text } from "@/components/ui/typography";
import { categoryPanelId, categoryTabId, CategoryNav } from "./category-nav";
import { MenuItemCard } from "./menu-item-card";

/** Matches the 2 / 3 / 4 column breakpoints of the items grid. */
const ITEM_IMAGE_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw";

export type MenuBrowserProps = {
  sections: MenuSection[];
};

/**
 * Category-first menu browser.
 *
 * The server fetches every active category and its items once and passes them
 * here; this client island only tracks which category is selected, so changing
 * category never triggers a request, a navigation, or a re-render of the page
 * shell. The first category is selected automatically.
 */
export function MenuBrowser({ sections }: MenuBrowserProps) {
  const t = useTranslations("Menu");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => sections[0]?.category.id ?? "",
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

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

  const activeSection =
    sections.find((section) => section.category.id === activeCategoryId) ??
    sections[0];

  if (!activeSection) return null;

  return (
    <>
      <CategoryNav
        categories={sections.map((section) => section.category)}
        activeId={activeSection.category.id}
        onSelect={setActiveCategoryId}
      />

      <Container className="py-[var(--section-gap)]">
        <div
          ref={panelRef}
          role="tabpanel"
          id={categoryPanelId(activeSection.category.id)}
          aria-labelledby={categoryTabId(activeSection.category.id)}
          tabIndex={0}
          className="scroll-mt-36"
        >
          <div className="max-w-prose">
            <Heading as="h2" size="lg">{activeSection.category.name}</Heading>
            {activeSection.category.description ? (
              <Text tone="muted" className="mt-2 text-pretty">
                {activeSection.category.description}
              </Text>
            ) : null}
          </div>

          {activeSection.items.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 xl:gap-4">
              {activeSection.items.map((item) => (
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
        </div>
      </Container>
    </>
  );
}
