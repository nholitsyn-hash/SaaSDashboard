import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Plug,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import type { Role } from "@/shared/types/auth";

/**
 * Sidebar navigation config.
 *
 * WHY data-driven (not hardcoded JSX):
 * Consumers (Sidebar component, breadcrumb future component, command palette
 * future feature) all need to iterate over the same nav structure. Keeping
 * it as plain data means adding a link = editing this file, never touching
 * rendering logic.
 *
 * WHY `roles` is an allowlist:
 * If `roles` is omitted, the item shows for everyone. If present, the user's
 * role must be in the list. Cleaner than having a separate "public" flag.
 *
 * WHY `NavBadge` is a tagged union (not a plain string):
 * Count badges (number) and "Soon" labels render differently — different
 * colors, different semantics. A discriminated union lets the renderer
 * switch on `kind` with type safety, no stringly-typed parsing.
 */

export type NavBadge =
  | { kind: "count"; value: number }
  | { kind: "soon" };

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: Role[];
  badge?: NavBadge;
}

export interface NavGroup {
  /** Section header; omit for the footer group (e.g. Settings). */
  label?: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    label: "Customers",
    items: [
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
      {
        label: "Signups",
        href: "/signups",
        icon: UserPlus,
        badge: { kind: "count", value: 12 },
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        label: "AI Assistant",
        href: "/ai-assistant",
        icon: Sparkles,
        badge: { kind: "soon" },
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        label: "Team & Permissions",
        href: "/admin/team",
        icon: Shield,
        roles: ["super_admin"],
      },
      {
        label: "Integrations",
        href: "/admin/integrations",
        icon: Plug,
        roles: ["super_admin"],
      },
      {
        label: "Billing",
        href: "/admin/billing",
        icon: Receipt,
        roles: ["super_admin"],
      },
    ],
  },
  {
    // Footer group — no label, sits at the bottom
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
