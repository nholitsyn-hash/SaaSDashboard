"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";
import { useSidebarStore } from "@/shared/store/sidebar";
import type { Role } from "@/shared/types/auth";
import { TopbarSearch } from "./TopbarSearch";
import { TopbarNotifications } from "./TopbarNotifications";
import { TopbarUserMenu } from "./TopbarUserMenu";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
}

/**
 * Topbar — persistent app header, sticky across routes.
 *
 * WHY sticky (not fixed):
 * Sticky reserves layout space the way fixed doesn't. With fixed the main
 * content would shift under the topbar unless we also add padding-top —
 * fragile. Sticky + `top-0` gives scroll-follow behavior with correct
 * layout flow. Same pattern we used on the Sidebar.
 *
 * WHY hamburger is only visible on <lg:
 * The desktop Sidebar is always visible at ≥lg; no need to open a drawer
 * there. Showing hamburger at ≥lg would be redundant noise.
 */
export function Topbar({ user }: TopbarProps) {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 items-center gap-3
        border-b border-border-default bg-bg-surface
        px-4 sm:px-6
        print:hidden
      "
    >
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="
          inline-flex h-9 w-9 items-center justify-center rounded-lg
          border border-border-default bg-bg-surface
          text-text-secondary transition-colors
          hover:bg-bg-muted hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-border-focus focus-visible:ring-offset-2
          lg:hidden
        "
      >
        <Menu size={18} />
      </button>

      <TopbarSearch />

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <TopbarNotifications />
        <TopbarUserMenu user={user} />
      </div>
    </header>
  );
}
