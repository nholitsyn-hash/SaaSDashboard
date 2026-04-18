import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Sidebar state — collapsed/expanded on desktop, open/closed on mobile.
 *
 * WHY two separate booleans (not one "isOpen"):
 * Desktop collapse is a user preference that should persist across sessions
 * — the user wants icon-only on every visit. Mobile open/closed is ephemeral
 * — nobody wants the drawer re-opening every time they return to the app.
 * Different lifetimes = different fields.
 *
 * WHY partialize in persist:
 * We only want to persist `isCollapsed`. If we persisted `isMobileOpen`,
 * users would land on a page with the mobile drawer open from last visit —
 * intrusive and confusing. partialize lets us opt exactly one field into
 * localStorage.
 *
 * WHY `setMobileOpen(boolean)` instead of `openMobile()` + `closeMobile()`:
 * One setter with an explicit boolean lets consumers pass a state-dependent
 * value in one call (e.g. on backdrop click → setMobileOpen(false)). Two
 * action creators would force two code paths for what's really one concept.
 */

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isMobileOpen: false,
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setMobileOpen: (open) => set({ isMobileOpen: open }),
    }),
    {
      name: "sidebar-preferences",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
