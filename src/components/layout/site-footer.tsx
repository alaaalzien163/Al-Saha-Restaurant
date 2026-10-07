import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig, siteContact } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import {
  addressLines,
  hasAnyContact,
  mailtoHref,
  telHref,
} from "@/lib/utils/contact";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SocialIcon,
} from "@/components/contact/contact-icons";

/**
 * Public site footer.
 *
 * Server Component — no client JavaScript. Contact and social columns are
 * driven by `siteContact` and simply omitted when not configured, so the footer
 * stays balanced on every screen size.
 */
export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Navigation");
  const tSocial = await getTranslations("Social");
  const locale = await getLocale();
  const { address, phoneNumbers, email, socials } = siteContact;
  const phones = phoneNumbers ?? [];
  const addressLinesList = addressLines(address, locale);
  const hasContact = hasAnyContact(siteContact);
  const hasSocials = Boolean(socials && socials.length > 0);

  return (
    <footer className="border-t border-border bg-muted/30">
      <Container className="py-12">
        <div
          className={cn(
            "grid gap-10 sm:grid-cols-2",
            hasContact && "lg:grid-cols-3",
          )}
        >
          <div className="space-y-4">
            {/* <Brand />
            <p className="max-w-xs text-sm text-pretty text-muted-foreground">
              {t("description")}
            </p> */}

            {hasSocials ? (
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {t("followUs")}
                </h2>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {socials?.map((social) => (
                    <li key={social.href}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <SocialIcon
                          platform={social.platform}
                          className="size-4"
                        />
                        {tSocial(social.platform)}
                        <span className="sr-only">
                          {" "}
                          {t("opensInNewTab")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <nav aria-labelledby="footer-explore">
            <h2
              id="footer-explore"
              className="text-sm font-semibold text-foreground"
            >
              {t("explore")}
            </h2>
            <ul className="mt-3 space-y-1">
              {siteConfig.publicNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasContact ? (
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {t("contact")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {address && addressLinesList.length > 0 ? (
                  <li className="flex gap-2">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                    <address className="not-italic" dir="auto">
                      {addressLinesList.join(", ")}
                    </address>
                  </li>
                ) : null}

                {phones.length > 0 ? (
                  <li className="flex gap-2">
                    <PhoneIcon className="mt-0.5 size-4 shrink-0" />
                    <span className="flex flex-col gap-1">
                      {phones.map((entry) => (
                        <a
                          key={entry.number}
                          href={telHref(entry.number)}
                          aria-label={t("phoneLabel", {
                            number: entry.display,
                          })}
                          className="tabular-nums transition-colors hover:text-foreground"
                        >
                          {entry.display}
                        </a>
                      ))}
                    </span>
                  </li>
                ) : null}

                {email ? (
                  <li className="flex gap-2">
                    <MailIcon className="mt-0.5 size-4 shrink-0" />
                    <a
                      href={mailtoHref(email)}
                      className="break-words transition-colors hover:text-foreground"
                    >
                      {email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {siteConfig.name}. {t("rights")}
          </p>
          <p className="text-pretty">{t("note")}</p>
        </div>
      </Container>
    </footer>
  );
}
