"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useSidebarStore } from "@/shared/store/sidebar";
import { hasMinRole, type Role } from "@/shared/types/auth";
import { SidebarGroup } from "./SidebarGroup";
import { navGroups, type NavGroup } from "./nav";

interface SidebarDrawerProps {
  userRole: Role;
}

/**
 * SidebarDrawer — mobile-only nav drawer.
 *
 * WHY Radix Dialog instead of a hand-rolled overlay:
 * Radix handles focus trap, Escape key, body scroll lock, backdrop click,
 * and ARIA attributes (dialog role, labelled-by, aria-modal) correctly out
 * of the box. CLAUDE.md sanctions Radix for Dialog specifically. Writing
 * these behaviors by hand is a week of edge cases — dialogs are the
 * canonical use case for a primitive like this.
 *
 * WHY always expanded (no collapse toggle):
 * Collapsed icon-only mode is a desktop preference for saving horizontal
 * space. On mobile the drawer is modal — either open (full width) or
 * closed (hidden). An icon-only drawer would make no sense.
 *
 * WHY lg:hidden on both overlay and content:
 * The Sidebar component already handles `hidden lg:flex`. At ≥lg we want
 * zero drawer DOM so the rail works unobstructed. Without this the overlay
 * could steal clicks even when hidden.
 *
 * WHY onNavigate closes the drawer:
 * Radix Dialog doesn't auto-close on internal navigation because the link
 * render happens in a portal outside the route tree. We close explicitly
 * so users don't land on the new page with the drawer still covering it.
 */
export function SidebarDrawer({ userRole }: SidebarDrawerProps) {
  const pathname = usePathname() ?? "";
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  const visibleGroups = filterGroupsByRole(navGroups, userRole);
  const [footerGroup, ...bodyGroupsReversed] = [...visibleGroups].reverse();
  const bodyGroups = bodyGroupsReversed.reverse();

  const handleNavigate = () => setMobileOpen(false);

  return (
    <Dialog.Root open={isMobileOpen} onOpenChange={setMobileOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-40
            bg-black/50 backdrop-blur-sm
            opacity-0 transition-opacity duration-200
            data-[state=open]:opacity-100
            lg:hidden
          "
        />
        <Dialog.Content
          aria-describedby={undefined}
          className="
            fixed inset-y-0 left-0 z-50
            flex w-72 max-w-[85vw] flex-col
            bg-bg-surface shadow-lg
            -translate-x-full transition-transform duration-200 ease-out
            data-[state=open]:translate-x-0
            lg:hidden
          "
        >
          <Dialog.Title className="sr-only">Primary navigation</Dialog.Title>

          <DrawerHeader onClose={() => setMobileOpen(false)} />

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-3">
            {bodyGroups.map((group, idx) => (
              <SidebarGroup
                key={group.label ?? `group-${idx}`}
                group={group}
                currentPath={pathname}
                isCollapsed={false}
                onNavigate={handleNavigate}
              />
            ))}
          </div>

          {footerGroup && (
            <div className="border-t border-border-default p-2">
              <SidebarGroup
                group={footerGroup}
                currentPath={pathname}
                isCollapsed={false}
                onNavigate={handleNavigate}
              />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border-default px-3 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div
          aria-hidden
          className="
            flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            bg-gradient-to-br from-primary to-secondary
            text-xs font-bold text-white
          "
        >
          SA
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-text-primary truncate">
            SaaS Analytics
          </span>
          <span className="text-[11px] text-text-tertiary truncate">
            Workspace
          </span>
        </div>
      </div>
      <Dialog.Close asChild>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="
            inline-flex h-8 w-8 items-center justify-center rounded-md
            text-text-tertiary
            transition-colors
            hover:bg-bg-muted hover:text-text-primary
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus
          "
        >
          <X size={18} />
        </button>
      </Dialog.Close>
    </div>
  );
}

/**
 * Same role-filter as Sidebar.tsx; duplicated intentionally to keep the two
 * components self-contained rather than introducing a cross-dependency.
 * If a third consumer appears, lift into a helper.
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
