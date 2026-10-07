import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";

const MOBILE_IMAGE = "/images/hero/Hero.PNG";
const DESKTOP_IMAGE = "/images/hero/Hero.PNG";

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Full-bleed hero background with art direction: a portrait crop for small
 * screens and a landscape crop for `md` and up. Only one source is downloaded
 * per viewport. Decorative (alt=""), so it adds no screen-reader noise.
 */
function HeroMedia() {
  // 75 matches Next's configured `images.qualities` (the only allowed value),
  // so the optimizer emits it directly. Change both together to raise it.
  const common = { alt: "", sizes: "100vw", quality: 75 } as const;

  const {
    props: {
      srcSet: desktopSrcSet,
    },
  } = getImageProps({
    ...common,
    src: DESKTOP_IMAGE,
    width: 1920,
    height: 1080,
  });

  const {
    props: {
      src: mobileSrc,
      srcSet: mobileSrcSet,
      sizes,
      width,
      height,
    },
  } = getImageProps({
    ...common,
    src: MOBILE_IMAGE,
    width: 1080,
    height: 1350,
  });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        src={mobileSrc}
        srcSet={mobileSrcSet}
        sizes={sizes}
        width={width}
        height={height}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
    </picture>
  );
}

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative isolate flex min-h-[max(34rem,calc(100svh_-_4rem))] items-center overflow-hidden">
      <HeroMedia />

      {/* Guarantees text contrast over the photo in every color scheme. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-br from-black/85 via-black/60 to-black/30"
      />

      <Container className="relative z-10 py-[var(--section-gap)]">
        <div className="max-w-2xl">
          <Eyebrow className="text-accent">{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance text-white">
            {siteConfig.name}
          </h1>
          <p className="mt-5 max-w-prose text-lg text-pretty text-white/85">
            {t("description")}
          </p>
          <div className="mt-8">
            <ButtonLink href="/menu" size="lg" endIcon={<ArrowRightIcon />}>
              {t("ctaLabel")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
