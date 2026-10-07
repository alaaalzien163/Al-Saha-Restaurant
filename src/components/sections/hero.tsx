import { getImageProps } from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";

const MOBILE_IMAGE = "/images/hero/Hero.PNG";
const DESKTOP_IMAGE = "/images/hero/Hero.PNG";

function HeroMedia() {

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
  // Official restaurant name for the active locale, reused from the existing
  // `Metadata` catalog so the text is never duplicated or invented.
  const tSite = await getTranslations("Metadata");

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
            {tSite("title")}
          </h1>
          <p className="mt-5 max-w-prose text-lg text-pretty text-white/85">
            {t("description")}
          </p>
          {/* <div className="mt-8">
            <ButtonLink href="/menu" size="lg" endIcon={<ArrowRightIcon />}>
              {t("ctaLabel")}
            </ButtonLink>
          </div> */}
        </div>
      </Container>
    </section>
  );
}
