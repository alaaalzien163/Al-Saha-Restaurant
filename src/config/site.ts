/**
 * Central site configuration. Import this instead of repeating copy, URLs,
 * or navigation in individual components.
 */
export const siteConfig = {
  name: "Al-Saha Restaurant",
  shortName: "Al-Saha Restaurant", 
  monogram: "AS",
  description:
    " Al-Saha Restaurant — browse our freshly prepared dishes and visit us in-store . ",
  locale: "ar",
  /** Restaurant logo served from /public. Intrinsic size keeps layout stable. */
  logo: {
    src: "/images/logo-removebg-preview(1).png",
    width: 570,
    height: 438,
  },
  hero: {
    eyebrow: "Fresh from our kitchen",
    description:
      "Authentic, freshly prepared dishes served in a warm and welcoming space. Explore our menu and find your new favourite.",
    ctaLabel: "View the menu",
  },
  about: {
    eyebrow: "Our story",
    title: "A neighbourhood kitchen rooted in tradition",
    paragraphs: [
      "Al-Saha Resto started with a simple idea: cook the food we grew up with and serve it the way it should be — fresh, generous and full of flavour.",
      "Every plate is prepared in-house each day, from slow-simmered sauces to bread baked on the premises. No shortcuts, just honest cooking shared around the table.",
    ],
    values: [
      {
        title: "Fresh every day",
        description: "Prepared in small batches, never held over.",
      },
      {
        title: "Made in-house",
        description: "Sauces, breads and desserts from scratch.",
      },
      {
        title: "A warm welcome",
        description: "Friendly service for families and friends.",
      },
    ],
    imageAlt:
      "Warmly lit dining room at Al-Saha Resto glowing with ambient light",
  },
  menu: {
    eyebrow: "Our menu",
    title: "Freshly prepared, every day",
    description:
      "A selection of dishes made in-house from quality ingredients. Prices include everything — no surprises.",
    emptyTitle: "Our menu is being prepared",
    emptyDescription:
      "Fresh dishes are on their way. Please check back soon.",
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Get in touch",
    description:
      "Find us, call ahead, or send a message — we'd love to hear from you.",
    fallbackTitle: "Contact details coming soon",
    fallbackDescription:
      "We're updating our contact information. In the meantime, explore our menu.",
  },
  footer: {
    /** Secondary line shown beside the copyright. */
    note: "Fresh flavours, served with a warm welcome.",
  },
  publicNav: [
    { key: "home", label: "Home", href: "/" },
    { key: "menu", label: "Menu", href: "/menu" },
    /* About and Contact are sections on the homepage, not standalone routes. */
    { key: "about", label: "About", href: "/#about" },
    { key: "contact", label: "Contact", href: "/#contact" },
  ],
  adminNav: [
    { key: "overview", label: "Overview", href: "/admin" },
    { key: "categories", label: "Categories", href: "/admin/categories" },
    { key: "items", label: "Items", href: "/admin/items" },
    { key: "profile", label: "Profile", href: "/admin/profile" },
  ],
} as const;

export type NavItem = {
  /** Translation key in the `Navigation` message namespace. */
  key: string;
  label: string;
  href: string;
};

export type AdminNavItem = (typeof siteConfig.adminNav)[number];
export type AdminNavKey = AdminNavItem["key"];

export type SocialPlatform =
  | "instagram"
  | "facebook"
  | "x"
  | "tiktok"
  | "youtube";

/** URLs are data; the visible label is resolved from `platform` via i18n. */
export type SocialLink = {
  href: string;
  platform: SocialPlatform;
};

export type OpeningHours = {
  days: string;
  hours: string;
};

export type PhoneNumber = {
  /** Dialable number, e.g. "0987804058". Drives the `tel:` link. */
  number: string;
  /** Displayed verbatim, so the shown number always matches the dialed one. */
  display: string;
};

export type SiteAddress = {
  /** Lines rendered in order. Doubles as the fallback for every locale. */
  lines: readonly string[];
  /**
   * Optional per-locale lines keyed by locale ("en", "ar", …). A locale that
   * has no entry falls back to `lines`, so adding a translation later is a
   * config-only change and never leaves a locale without an address.
   */
  linesByLocale?: Readonly<Record<string, readonly string[]>>;
  /** Optional external link for a "Get directions" action. */
  directionsUrl?: string;
  /** Optional embeddable map URL, rendered lazily in an iframe. */
  mapEmbedUrl?: string;
};

export type SiteContact = {
  address?: SiteAddress;
  phoneNumbers?: readonly PhoneNumber[];
  whatsapp?: {
    /** Digits only incl. country code, e.g. "15551234567". */
    number: string;
    /** Optional prefilled message. */
    message?: string;
  };
  email?: string;
  hours?: readonly OpeningHours[];
  socials?: readonly SocialLink[];
};

/**
 * Restaurant contact details — the single source of truth for the Contact
 * section, contact page and footer. Every field is optional and omitted from
 * the UI when unset, so this stays the only place to edit.
 */
export const siteContact: SiteContact = {
  phoneNumbers: [
    { number: "0987804058", display: "0987804058" },
    { number: "0937776213", display: "0937776213" },
  ],
  /* Primary contact channel. Digits only incl. country code (Syria: +963). */
  whatsapp: {
    number: "963987804058",
  },
  address: {
    lines: ["مشروع دمر الجزيرة 10 الأب تاون مطعم الساحة"],
    linesByLocale: {
      /* No official English address yet — add it here when provided. */
    },
  },
  socials: [
    {
      platform: "facebook",
      href: "https://www.facebook.com/share/1JqiP2CTtu/?mibextid=wwXIfr",
    },
    {
      platform: "instagram",
      href: "https://www.instagram.com/alsaha.rest?stkn=eHJsODZscWluNDRx",
    },
  ],
};
