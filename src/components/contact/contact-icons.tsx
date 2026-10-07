import type { SVGProps } from "react";
import type { SocialPlatform } from "@/config/site";

type IconProps = SVGProps<SVGSVGElement>;

const strokeDefaults = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function strokeProps(props: IconProps): IconProps {
  return {
    "aria-hidden": true,
    focusable: false,
    viewBox: "0 0 24 24",
    ...strokeDefaults,
    ...props,
  };
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zm0 18.02c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.04 8.04 0 0 1-1.23-4.29c0-4.45 3.62-8.07 8.07-8.07 4.45 0 8.06 3.62 8.06 8.07 0 4.45-3.61 8.06-8.06 8.06zm4.42-6.04c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.1V14h2.4v7h3z" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M17.5 3h3l-6.6 7.5L21.8 21h-5.6l-4.4-5.7L6.7 21H3.6l7-8L2.6 3h5.7l4 5.3L17.5 3zm-1 16h1.7L8.1 4.7H6.3L16.5 19z" />
    </svg>
  );
}

function TikTokIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M14 3c.4 2 1.7 3.4 3.8 3.6v2.6c-1.3.1-2.5-.3-3.8-1v6.3c0 3.4-2.6 5.5-5.4 5.5C6 20 4 18.2 4 15.5c0-2.9 2.3-5 5.3-4.6v2.7c-.3-.1-.7-.2-1-.2-1.3 0-2.2.9-2.2 2.1 0 1.3.9 2.2 2.2 2.2 1.3 0 2.2-1 2.2-2.4V3H14z" />
    </svg>
  );
}

function YouTubeIcon(props: IconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="M10.5 9.5 15 12l-4.5 2.5z" />
    </svg>
  );
}

export function SocialIcon({
  platform,
  ...props
}: IconProps & { platform: SocialPlatform }) {
  switch (platform) {
    case "instagram":
      return <InstagramIcon {...props} />;
    case "facebook":
      return <FacebookIcon {...props} />;
    case "x":
      return <XIcon {...props} />;
    case "tiktok":
      return <TikTokIcon {...props} />;
    case "youtube":
      return <YouTubeIcon {...props} />;
    default:
      return <LinkIcon {...props} />;
  }
}
