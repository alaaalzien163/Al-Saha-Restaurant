import type { ComponentType, SVGProps } from "react";
import type { AdminNavKey } from "@/config/site";

export type AdminIconProps = SVGProps<SVGSVGElement>;

function strokeProps(props: AdminIconProps): AdminIconProps {
  return {
    "aria-hidden": true,
    focusable: false,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

export function OverviewIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function CategoriesIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

export function ItemsIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProfileIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function MenuIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function LogOutIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function PlusIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function PencilIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function TrashIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function ImageIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export function UploadIcon(props: AdminIconProps) {
  return (
    <svg {...strokeProps(props)}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 20h16" />
    </svg>
  );
}

/** Icon per admin nav item, keyed for type-safety. */
export const adminNavIcons: Record<
  AdminNavKey,
  ComponentType<AdminIconProps>
> = {
  overview: OverviewIcon,
  categories: CategoriesIcon,
  items: ItemsIcon,
  profile: ProfileIcon,
};
