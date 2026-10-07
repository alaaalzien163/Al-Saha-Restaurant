import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { siteContact } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { hasAnyContact, mailtoHref, telHref, whatsappHref } from "@/lib/utils/contact";
import { ContactChannel } from "./contact-channel";
import { ContactMap } from "./contact-map";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SocialIcon,
  WhatsAppIcon,
} from "./contact-icons";

type ContactAction = {
  key: string;
  label: string;
  href: string;
  external: boolean;
  icon: ReactNode;
};

function ExternalHint() {
  return <ArrowUpRightIcon className="size-4 text-muted-foreground" />;
}

export type ContactProps = {
  /** Optional section heading, for embedding the section on a page. */
  eyebrow?: string;
  title?: string;
  description?: string;
};

/**
 * Contact section.
 *
 * Server Component. Everything is driven by `siteContact`; fields that are not
 * configured are simply not rendered. When nothing is configured yet, a clear
 * fallback with a menu CTA is shown instead (no invented restaurant data).
 *
 * Pass `title`/`eyebrow`/`description` to render a section heading when the
 * component is embedded (e.g. on the homepage); the dedicated contact page
 * provides its own heading and passes none.
 */
export async function Contact({
  eyebrow,
  title,
  description,
}: ContactProps = {}) {
  const t = await getTranslations("Contact");
  const { address, phone, whatsapp, email, hours, socials } = siteContact;

  const heading = title ? (
    <header className="mb-8 max-w-prose">
      {eyebrow ? <Eyebrow className="text-primary">{eyebrow}</Eyebrow> : null}
      <Heading as="h2" size="xl" className={eyebrow ? "mt-3" : undefined}>
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" className="mt-3 text-pretty">
          {description}
        </Text>
      ) : null}
    </header>
  ) : null;

  if (!hasAnyContact(siteContact)) {
    return (
      <Container className="py-[var(--section-gap)]">
        {heading}
        <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center sm:p-12">
          <span
            aria-hidden="true"
            className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <MapPinIcon className="size-6" />
          </span>
          {title ? null : (
            <Heading as="h2" size="lg" className="mt-4">
              {t("fallbackTitle")}
            </Heading>
          )}
          <Text tone="muted" className="mx-auto mt-2 max-w-prose text-pretty">
            {t("fallbackDescription")}
          </Text>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/menu" endIcon={<ArrowRightIcon className="size-5" />}>
              {t("viewMenu")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  const actions: ContactAction[] = [];
  if (whatsapp) {
    actions.push({
      key: "whatsapp",
      label: t("actionWhatsapp"),
      href: whatsappHref(whatsapp.number, whatsapp.message),
      external: true,
      icon: <WhatsAppIcon className="size-5" />,
    });
  }
  if (phone) {
    actions.push({
      key: "phone",
      label: t("actionPhone", { number: phone.display }),
      href: telHref(phone.number),
      external: false,
      icon: <PhoneIcon className="size-5" />,
    });
  }
  if (email) {
    actions.push({
      key: "email",
      label: t("actionEmail"),
      href: mailtoHref(email),
      external: false,
      icon: <MailIcon className="size-5" />,
    });
  }
  if (address?.directionsUrl) {
    actions.push({
      key: "directions",
      label: t("actionDirections"),
      href: address.directionsUrl,
      external: true,
      icon: <MapPinIcon className="size-5" />,
    });
  }

  const hasMap = Boolean(address?.mapEmbedUrl);

  return (
    <Container className="py-[var(--section-gap)]">
      {heading}
      <div className={cn("grid gap-10", hasMap && "lg:grid-cols-2 lg:gap-16")}>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {address && address.lines.length > 0 ? (
              <ContactChannel
                icon={<MapPinIcon className="size-4" />}
                label={t("channelVisit")}
              >
                <address className="not-italic">
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                {address.directionsUrl ? (
                  <a
                    href={address.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    {t("actionDirections")}
                    <ExternalHint />
                  </a>
                ) : null}
              </ContactChannel>
            ) : null}

            {phone ? (
              <ContactChannel
                icon={<PhoneIcon className="size-4" />}
                label={t("channelCall")}
              >
                <a
                  href={telHref(phone.number)}
                  className="font-medium text-primary hover:underline"
                >
                  {phone.display}
                </a>
              </ContactChannel>
            ) : null}

            {email ? (
              <ContactChannel
                icon={<MailIcon className="size-4" />}
                label={t("channelEmail")}
              >
                <a
                  href={mailtoHref(email)}
                  className="font-medium break-words text-primary hover:underline"
                >
                  {email}
                </a>
              </ContactChannel>
            ) : null}

            {hours && hours.length > 0 ? (
              <ContactChannel
                icon={<ClockIcon className="size-4" />}
                label={t("channelHours")}
              >
                <dl className="space-y-1 text-sm">
                  {hours.map((entry) => (
                    <div
                      key={entry.days}
                      className="flex justify-between gap-3"
                    >
                      <dt className="text-muted-foreground">{entry.days}</dt>
                      <dd className="font-medium tabular-nums">
                        {entry.hours}
                      </dd>
                    </div>
                  ))}
                </dl>
              </ContactChannel>
            ) : null}
          </div>

          {actions.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {actions.map((action, index) => (
                <ButtonLink
                  key={action.key}
                  href={action.href}
                  variant={index === 0 ? "primary" : "outline"}
                  startIcon={action.icon}
                  {...(action.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {action.label}
                </ButtonLink>
              ))}
            </div>
          ) : null}

          {socials && socials.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {t("followUs")}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <SocialIcon
                        platform={social.platform}
                        className="size-4"
                      />
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {address?.mapEmbedUrl ? (
          <ContactMap embedUrl={address.mapEmbedUrl} />
        ) : null}
      </div>
    </Container>
  );
}
