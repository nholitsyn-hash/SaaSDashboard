"use client";

import Link from "next/link";
import { Badge } from "@/shared/ui";
import type { NavItem } from "./nav";

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

/**
 * SidebarItem — a single nav link.
 *
 * WHY `aria-current={isActive ? "page" : undefined}`:
 * This is the canonical way to tell screen readers the currently-selected
 * nav item. Using `aria-current` is better than just styling because it
 * works independently of CSS — accessibility doesn't rely on color.
 *
 * WHY `title` attribute when collapsed:
 * In icon-only mode, sighted users need a way to see the label. `title`
 * gives a native browser tooltip for free. We could swap to a Radix
 * Tooltip later for consistent styling, but native is zero-cost today.
 *
 * WHY conditional render of label + badge (not opacity fade):
 * Keeping them in the DOM with opacity would preserve their layout width,
 * breaking the 64px collapsed target. Removing from the tree is the only
 * way the flex row actually shrinks to icon-width.
 */
export function SidebarItem({
  item,
  isActive,
  isCollapsed,
  onNavigate,
}: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      title={isCollapsed ? item.label : undefined}
      className={`
        group flex items-center gap-3 rounded-lg
        px-3 py-2 transition-colors
        ${isCollapsed ? "justify-center" : ""}
        ${
          isActive
            ? "bg-primary-subtle text-primary-text"
            : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
        }
      `}
    >
      <Icon size={18} strokeWidth={2} className="shrink-0" />
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate text-sm font-medium">
            {item.label}
          </span>
          {item.badge && <ItemBadge badge={item.badge} />}
        </>
      )}
    </Link>
  );
}

function ItemBadge({ badge }: { badge: NonNullable<NavItem["badge"]> }) {
  if (badge.kind === "soon") {
    return (
      <Badge variant="secondary" className="text-[10px]">
        Soon
      </Badge>
    );
  }
  return (
    <Badge variant="danger" className="text-[10px] tabular-nums">
      {badge.value}
    </Badge>
  );
}
