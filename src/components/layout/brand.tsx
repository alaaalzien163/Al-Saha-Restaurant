import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export type BrandProps = {
  className?: string;
  /** Optional click handler, used by the mobile menu to close on navigation. */
  onNavigate?: () => void;
  /** Destination of the brand link. Defaults to the site root. */
  href?: string;
  /** Render the restaurant logo image instead of the monogram. */
  showLogo?: boolean;
  /** Translated alt text for the logo image. */
  logoAlt?: string;
  /** Translated accessible name for the link (overrides the visible text). */
  label?: string;
};

/** Logo + wordmark. Presentational, so it stays usable in server and client trees. */
export function Brand({
  className,
  onNavigate,
  href = "/",
  showLogo = false,
  logoAlt,
  label,
}: BrandProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={label}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-md",
        className,
      )}
    >
      {showLogo ? (
        <Image
          src={siteConfig.logo.src}
          width={siteConfig.logo.width}
          height={siteConfig.logo.height}
          alt={logoAlt ?? siteConfig.name}
          priority
          sizes="(min-width: 768px) 44px, 32px"
          className="h-8 w-auto shrink-0 object-contain sm:h-10 md:h-11 dark:invert"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          {siteConfig.monogram}
        </span>
      )}
      <span className="text-base font-semibold tracking-tight sm:text-lg">
        {siteConfig.name}
      </span>
    </Link>
  );
}
