import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";

const ABOUT_IMAGE = "/images/about/about.jpeg";

const VALUE_KEYS = [
  ["valueFreshTitle", "valueFreshDescription"],
  ["valueMadeTitle", "valueMadeDescription"],
  ["valueWelcomeTitle", "valueWelcomeDescription"],
] as const;

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-5 shrink-0 text-primary"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * About / story section.
 *
 * Server Component. Two columns on large screens, naturally stacked on mobile.
 * The supporting image is lazy-loaded (it sits below the fold) inside a fixed
 * aspect-ratio frame so it never causes layout shift.
 */
export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="about" className="py-[var(--section-gap)]">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
            <Image
              src={ABOUT_IMAGE}
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <Eyebrow className="text-primary">{t("eyebrow")}</Eyebrow>
            <Heading as="h2" size="xl" className="mt-3">
              {t("title")}
            </Heading>

            <div className="mt-5 space-y-4">
              <Text tone="muted" className="max-w-prose text-pretty">
                {t("paragraph1")}
              </Text>
            </div>

            <ul className="mt-8 space-y-4">
              {VALUE_KEYS.map(([titleKey]) => (
                <li key={titleKey} className="flex gap-3">
                  <CheckIcon />
                  <div>
                    <p className="font-medium text-foreground">
                      {t(titleKey)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
