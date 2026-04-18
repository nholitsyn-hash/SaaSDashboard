"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarBrandProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * SidebarBrand — logo monogram + product name + collapse toggle.
 *
 * WHY a monogram square instead of an SVG logo:
 * Placeholder for a real brand mark. A gradient square with "SA" reads as
 * "logo here" and doesn't look broken. When a real logo lands, swap the
 * inner div for an <Image> — rest of the layout stays.
 *
 * WHY the collapse toggle lives here (not at sidebar bottom, not floating):
 * Keeping it inside the brand row makes the header self-contained: one row
 * handles identity + state control. Floating edge buttons (like Linear's)
 * look great but add positioning complexity that isn't worth it yet.
 */
export function SidebarBrand({
  isCollapsed,
  onToggleCollapsed,
}: SidebarBrandProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-3 py-4 border-b border-border-default
        ${isCollapsed ? "flex-col" : "justify-between"}
      `}
    >
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
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              SaaS Analytics
            </span>
            <span className="text-[11px] text-text-tertiary truncate">
              Workspace
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!isCollapsed}
        title={isCollapsed ? "Expand" : "Collapse"}
        className="
          inline-flex h-7 w-7 items-center justify-center rounded-md
          text-text-tertiary
          transition-colors
          hover:bg-bg-muted hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-border-focus
        "
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
}
