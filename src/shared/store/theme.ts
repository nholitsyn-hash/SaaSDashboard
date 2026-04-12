"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/shared/types/theme";
import { THEME_STORAGE_KEY } from "@/shared/types/theme";

/**
 * Theme store — Zustand with persist middleware
 *
 * WHY Zustand instead of useState + useEffect:
 * Theme is global state that multiple components will consume —
 * the header toggle, settings page, maybe a command palette.
 * Zustand gives us a single store accessible from anywhere without
 * prop drilling or context providers wrapping the tree.
 *
 * WHY persist middleware:
 * Handles localStorage read/write automatically. On the server it
 * returns the default value; on the client it rehydrates from
 * localStorage after mount.
 *
 * WHY no _hasHydrated in the store:
 * Hydration tracking is a rendering concern, not store state.
 * Components that need it should use a local useMounted() pattern.
 * Keeps the store focused on what it owns: theme + actions.
 */

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: THEME_STORAGE_KEY,
    }
  )
);

/**
 * DOM sync is handled by ThemeProvider (shared/ui/ThemeProvider.tsx),
 * not here. The store only manages state + persistence.
 * See ThemeProvider for WHY a component is more reliable than
 * module-level subscribe for DOM attribute sync.
 */
