"use client";

import { useThemeStore } from "@/shared/store/theme";
import { useMounted } from "./useMounted";
import {
  ECHARTS_THEME_LIGHT,
  ECHARTS_THEME_DARK,
} from "@/shared/config/echarts-theme";

/**
 * Returns the ECharts theme name matching the current app theme.
 *
 * WHY gated by useMounted:
 * Zustand persist hydrates from localStorage after mount. On the server
 * and first client render, the store returns the default ("light").
 * If the user's persisted theme is dark, the chart would render in light
 * briefly, then repaint — visible flicker. Returning `light` until mounted
 * matches the SSR output, and the first client update uses the true value.
 *
 * WHY not read `data-theme` from <html>:
 * That would work, but it couples this hook to the DOM attribute contract.
 * Reading from the Zustand store keeps the source of truth in one place
 * (the store) and lets us change the DOM-sync mechanism independently.
 */
export function useEChartsTheme(): typeof ECHARTS_THEME_LIGHT | typeof ECHARTS_THEME_DARK {
  const theme = useThemeStore((state) => state.theme);
  const mounted = useMounted();

  if (!mounted) return ECHARTS_THEME_LIGHT;
  return theme === "dark" ? ECHARTS_THEME_DARK : ECHARTS_THEME_LIGHT;
}
