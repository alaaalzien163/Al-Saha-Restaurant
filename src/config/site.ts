/**
 * Central site configuration. Import this instead of repeating copy, URLs,
 * or navigation in individual components.
 */
export const siteConfig = {
  name: "Al-Saha Resto",
  shortName: "Al-Saha",
  monogram: "AS",
  description:
    "Al-Saha Resto — browse our freshly prepared dishes and visit us in-store.",
  locale: "en",
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

export type SocialLink = {
  label: string;
  href: string;
  platform: SocialPlatform;
};

export type OpeningHours = {
  days: string;
  hours: string;
};

export type SiteContact = {
  address?: {
    /** Street / city lines, rendered in order. */
    lines: readonly string[];
    /** Optional external link for a "Get directions" action. */
    directionsUrl?: string;
    /** Optional embeddable map URL, rendered lazily in an iframe. */
    mapEmbedUrl?: string;
  };
  phone?: {
    /** Dialable number, e.g. "+15551234567". Used for the `tel:` link. */
    number: string;
    /** Human-readable display, e.g. "+1 (555) 123-4567". */
    display: string;
  };
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
 * Restaurant contact details — the single source of truth for the Contact page.
 *
 * Intentionally empty: no restaurant information is invented here. Every field
 * is optional and is omitted from the UI when unset. Fill in only the values
 * that are actually available:
 *
 *   address: { lines: ["123 Example St", "City"], directionsUrl: "https://maps.google.com/?q=..." },
 *   phone: { number: "+15551234567", display: "+1 (555) 123-4567" },
 *   whatsapp: { number: "15551234567", message: "Hello Al-Saha Resto!" },
 *   email: "hello@example.com",
 *   hours: [{ days: "Mon–Fri", hours: "11:00 – 22:00" }],
 *   socials: [{ label: "Instagram", href: "https://instagram.com/…", platform: "instagram" }],
 */
export const siteContact: SiteContact = {};
