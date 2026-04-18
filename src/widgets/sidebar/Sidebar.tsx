"use client";

import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/shared/store/sidebar";
import { hasMinRole, type Role } from "@/shared/types/auth";
import { SidebarBrand } from "./SidebarBrand";
import { SidebarGroup } from "./SidebarGroup";
import { navGroups, type NavGroup } from "./nav";

interface SidebarProps {
  userRole: Role;
}

/**
 * Sidebar — desktop nav rail.
 *
 * WHY `userRole` comes in as a prop (not read from session here):
 * Session fetching is server-side. Having the sidebar (a client component)
 * import session data would force it to use SessionProvider + useSession(),
 * which adds a client-side fetch. The layout already has the session server-
 * side; passing role as a prop avoids the extra round trip and keeps this
 * component synchronous.
 *
 * WHY role filtering here (not in nav.ts):
 * The nav data is static config — doesn't know about the logged-in user.
 * Filtering is a runtime concern; it belongs with the component that knows
 * "who is viewing."
 *
 * WHY width via inline `style` instead of class switch:
 * The collapse animation needs a smooth width transition. Two classes
 * (w-64 vs w-16) still animate via transition-[width], but an inline
 * numeric style is the simplest expression and works identically with
 * Tailwind's transition utility.
 *
 * WHY hidden on <lg: that's the mobile drawer's job (Shell Step 3).
 * This component only handles the desktop rail; the drawer composes the
 * same groups/items inside a portal.
 */
export function Sidebar({ userRole }: SidebarProps) {
  // usePathname is typed `string | null` but in App Router it's always a
  // string at render time; fall back to "" for the rare null case.
  const pathname = usePathname() ?? "";
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);

  const visibleGroups = filterGroupsByRole(navGroups, userRole);
  const [footerGroup, ...bodyGroupsReversed] = [...visibleGroups].reverse();
  const bodyGroups = bodyGroupsReversed.reverse();

  return (
    <aside
      aria-label="Primary navigation"
      style={{ width: isCollapsed ? 64 : 256 }}
      className="
        hidden lg:flex flex-col shrink-0
        h-screen sticky top-0
        bg-bg-surface border-r border-border-default
        transition-[width] duration-200 ease-out
      "
    >
      <SidebarBrand
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-3">
        {bodyGroups.map((group, idx) => (
          <SidebarGroup
            key={group.label ?? `group-${idx}`}
            group={group}
            currentPath={pathname}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {footerGroup && (
        <div className="border-t border-border-default p-2">
          <SidebarGroup
            group={footerGroup}
            currentPath={pathname}
            isCollapsed={isCollapsed}
          />
        </div>
      )}
    </aside>
  );
}

/**
 * Filters groups by role, dropping items the user can't see and empty
 * groups entirely (so we don't render a lone section header).
 */
function filterGroupsByRole(groups: NavGroup[], role: Role): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.some((r) => hasMinRole(role, r))
      ),
    }))
    .filter((group) => group.items.length > 0);
}
