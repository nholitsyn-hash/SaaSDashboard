"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/shared/store/theme";
import { THEME_ATTRIBUTE } from "@/shared/types/theme";

/**
 * ThemeProvider — syncs Zustand theme state to the DOM.
 *
 * WHY a component instead of module-level subscribe:
 * Module-level side effects depend on import timing, which varies
 * between dev server, production build, and page refreshes. A React
 * component has a guaranteed lifecycle: mount → effect → re-render.
 *
 * WHY useEffect for the attribute:
 * useEffect runs after hydration, so the server-rendered <html>
 * (without data-theme) matches the initial client render. After
 * mount, Zustand persist rehydrates from localStorage, theme updates,
 * this component re-renders, and useEffect sets the attribute.
 * React owns the entire flow — no race conditions.
 *
 * This component wraps {children} in layout.tsx so it's always mounted.
 */
export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  return <>{children}</>;
}
