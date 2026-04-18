"use client";

import { Search } from "lucide-react";

/**
 * TopbarSearch — global search affordance, visual only for now.
 *
 * WHY hidden <md:
 * On narrow viewports the topbar has hamburger + theme + notif + avatar
 * already; cramming search in causes overflow or truncated placeholders.
 * Mobile-era SaaS dashboards typically surface search via a dedicated
 * command palette triggered by "/" or the hamburger menu. We'll add one
 * in a later phase if the demo needs it.
 *
 * WHY no clear button, suggestions, or handlers yet:
 * UI-first pass. Wiring search needs a backend endpoint + typeahead UI —
 * that's its own feature, not shell scaffolding.
 */
export function TopbarSearch() {
  return (
    <div className="relative hidden md:flex flex-1 max-w-md">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
      />
      <input
        type="search"
        placeholder="Search customers, reports…"
        aria-label="Search"
        className="
          w-full rounded-lg border border-border-default
          bg-bg-base py-2 pl-9 pr-3 text-sm
          text-text-primary placeholder:text-text-tertiary
          transition-colors
          hover:border-border-strong
          focus:border-border-focus focus:outline-none
          focus:ring-2 focus:ring-border-focus/30
        "
      />
    </div>
  );
}
