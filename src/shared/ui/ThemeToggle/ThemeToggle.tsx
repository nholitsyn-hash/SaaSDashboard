"use client";

import { useThemeStore } from "@/shared/store/theme";
import { useMounted } from "@/shared/hooks/useMounted";

/**
 * ThemeToggle — icon-button that flips light/dark.
 *
 * WHY inline SVG icons instead of a lib:
 * We don't have a icon library yet and don't want to add one just for
 * two glyphs. Inline SVG ships zero JS and is fully themable via
 * currentColor. When we install lucide-react in Phase 4/5 for the full
 * shell, swap these two glyphs for <Sun/> / <Moon/>.
 *
 * WHY useMounted gate:
 * Zustand `persist` rehydrates from localStorage after mount. Rendering
 * the true icon on SSR would mismatch the client (flicker, hydration
 * warning). Showing the light icon as a neutral default until mounted
 * keeps the SSR HTML stable, then the first client render corrects it.
 *
 * WHY this lives in shared/ui/:
 * It's a presentation component — it reads a store and renders a button.
 * No business logic. Same home as Button, Card, Badge. It will sit in
 * the topbar once the shell lands; for now the dashboard uses it until
 * the shell exists.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const mounted = useMounted();

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`
        inline-flex h-9 w-9 items-center justify-center
        rounded-lg border border-border-default
        bg-bg-surface text-text-secondary
        transition-colors
        hover:bg-bg-muted hover:text-text-primary
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-border-focus focus-visible:ring-offset-2
        ${className}
      `}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
