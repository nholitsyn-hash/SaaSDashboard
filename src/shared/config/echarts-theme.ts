/**
 * ECharts themes — light + dark — wired to our CSS design tokens.
 *
 * WHY two themes instead of reading CSS vars at runtime:
 * ECharts computes option objects once per render. If we put `var(--primary)`
 * inside the option, ECharts passes it to canvas as a string — canvas doesn't
 * resolve CSS variables, you get black. We must resolve to concrete hex/rgba
 * before handing values to ECharts.
 *
 * WHY hardcode hex here instead of reading from getComputedStyle:
 * Reading computed styles requires a DOM node + triggers layout. Registering
 * static themes is faster, deterministic, and SSR-safe. If tokens change in
 * tokens.css, update the matching hex here. Keep in sync by convention.
 *
 * WHY register themes up front:
 * `echarts.registerTheme(name, obj)` is idempotent and cheap. Registering
 * both light + dark at module load lets widgets pass `theme="saas-light"` or
 * `"saas-dark"` via a string — no per-widget theme assembly.
 *
 * Usage (in widgets):
 *   const themeName = useEChartsTheme(); // "saas-light" | "saas-dark"
 *   <ReactECharts option={option} theme={themeName} />
 */

import { echarts } from "./echarts";

// Raw scale values mirrored from tokens.css. Keep in sync.
const palette = {
  slate50: "#f8fafc",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  slate950: "#020617",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",
  violet400: "#a78bfa",
  violet500: "#8b5cf6",
  violet600: "#7c3aed",
  teal400: "#2dd4bf",
  teal500: "#14b8a6",
  teal600: "#0d9488",
  green500: "#22c55e",
  green600: "#16a34a",
  amber400: "#fbbf24",
  amber500: "#f59e0b",
  red500: "#ef4444",
  red600: "#dc2626",
} as const;

export const ECHARTS_THEME_LIGHT = "saas-light";
export const ECHARTS_THEME_DARK = "saas-dark";

const lightTheme = {
  // Categorical color cycle for multi-series charts
  color: [
    palette.blue600,
    palette.violet600,
    palette.teal600,
    palette.amber500,
    palette.green600,
    palette.red600,
  ],
  backgroundColor: "transparent",
  textStyle: {
    color: palette.slate900,
    fontFamily: "inherit",
  },
  title: {
    textStyle: { color: palette.slate900 },
    subtextStyle: { color: palette.slate500 },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: palette.slate200 } },
    axisTick: { lineStyle: { color: palette.slate200 } },
    axisLabel: { color: palette.slate500 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: palette.slate500 },
    splitLine: { lineStyle: { color: palette.slate200, type: "dashed" as const } },
  },
  legend: {
    textStyle: { color: palette.slate600 },
    inactiveColor: palette.slate300,
  },
  tooltip: {
    backgroundColor: "#ffffff",
    borderColor: palette.slate200,
    textStyle: { color: palette.slate900 },
    extraCssText: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 6px;",
  },
};

const darkTheme = {
  color: [
    palette.blue400,
    palette.violet400,
    palette.teal400,
    palette.amber400,
    palette.green500,
    palette.red500,
  ],
  backgroundColor: "transparent",
  textStyle: {
    color: palette.slate50,
    fontFamily: "inherit",
  },
  title: {
    textStyle: { color: palette.slate50 },
    subtextStyle: { color: palette.slate400 },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: palette.slate700 } },
    axisTick: { lineStyle: { color: palette.slate700 } },
    axisLabel: { color: palette.slate400 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: palette.slate400 },
    splitLine: { lineStyle: { color: palette.slate700, type: "dashed" as const } },
  },
  legend: {
    textStyle: { color: palette.slate300 },
    inactiveColor: palette.slate600,
  },
  tooltip: {
    backgroundColor: palette.slate800,
    borderColor: palette.slate700,
    textStyle: { color: palette.slate50 },
    extraCssText: "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.4); border-radius: 6px;",
  },
};

echarts.registerTheme(ECHARTS_THEME_LIGHT, lightTheme);
echarts.registerTheme(ECHARTS_THEME_DARK, darkTheme);
