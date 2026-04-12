"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type Theme,
  THEME_STORAGE_KEY,
  THEME_ATTRIBUTE,
} from "@/shared/types/theme";

/**
 * useTheme — manages light/dark theme toggling
 *
 * WHY this is in shared/hooks (not features/):
 * Theme toggling is a generic UI concern, not a business feature.
 * It has no domain knowledge — just reads/writes a data attribute.
 * Any layer can consume it.
 *
 * WHY useState + useEffect instead of Zustand:
 * Theme state needs to sync with two external systems:
 *   1. localStorage (persistence across sessions)
 *   2. The DOM data-attribute on <html> (CSS token switching)
 * This is one of the rare cases where useEffect is the right tool —
 * we're synchronizing React state with external side effects.
 * Zustand would add indirection without benefit here.
 *
 * WHY we read from the DOM on mount (not just localStorage):
 * The layout.tsx injects an inline script that sets the attribute
 * BEFORE React hydrates — this prevents the flash of wrong theme (FOWT).
 * So the DOM is the source of truth on first render.
 */

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, toggleTheme, setTheme } as const;
}
