"use client";

import { SidebarItem } from "./SidebarItem";
import type { NavGroup } from "./nav";

interface SidebarGroupProps {
  group: NavGroup;
  currentPath: string;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

/**
 * SidebarGroup — labeled section with its items.
 *
 * WHY `isActive` comparison uses startsWith + "/":
 * A strict `===` on href would fail for nested routes (e.g. user on
 * /admin/team/42 with nav item href /admin/team). Adding the trailing
 * "/" prevents false positives where /customers would match
 * /customers-insights (since that "starts with" /customers without a slash).
 */
export function SidebarGroup({
  group,
  currentPath,
  isCollapsed,
  onNavigate,
}: SidebarGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {group.label && !isCollapsed && (
        <h2 className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {group.label}
        </h2>
      )}
      {group.label && isCollapsed && (
        <div
          aria-hidden
          className="mx-3 my-2 h-px bg-border-subtle"
        />
      )}
      <nav className="flex flex-col gap-0.5">
        {group.items.map((item) => {
          const isActive =
            currentPath === item.href ||
            currentPath.startsWith(item.href + "/");
          return (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={isActive}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          );
        })}
      </nav>
    </div>
  );
}
