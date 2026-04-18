"use client";

import ReactECharts from "echarts-for-react";
import type { ECOption } from "@/shared/config";
import { useEChartsTheme } from "@/shared/hooks/useEChartsTheme";

/**
 * Chart — app-wide ECharts wrapper.
 *
 * WHY a wrapper instead of each widget rendering <ReactECharts />:
 * Every widget needs the same three things — current theme name, full-size
 * fill, and a remount trigger when the theme flips. Centralizing this
 * removes 6+ copies of the same boilerplate and guarantees consistent
 * behavior (e.g. if we later add lazy-init or resize handling, one edit
 * covers every chart).
 *
 * WHY `key={theme}`:
 * `echarts-for-react` reads the `theme` prop only at init — changing it
 * later has no effect. Keying by theme forces React to unmount+remount the
 * chart when the user flips the toggle, so a fresh ECharts instance is
 * created with the new theme. Cheap because charts are small and infrequent.
 *
 * WHY notMerge + lazyUpdate:
 * notMerge: when `option` changes, replace wholesale instead of deep-merging
 * (which causes stale series/axes to linger). lazyUpdate: batch updates
 * across render cycles into a single repaint.
 *
 * WHY size via inline style:
 * `echarts-for-react` defaults to a fixed 300px height, ignoring CSS.
 * Inline width/height 100% makes the chart fill whatever container it's in
 * (e.g. ChartCard's height slot, or the sparkline slot on KpiCard).
 */

interface ChartProps {
  option: ECOption;
  className?: string;
}

export function Chart({ option, className = "" }: ChartProps) {
  const theme = useEChartsTheme();

  return (
    <ReactECharts
      key={theme}
      option={option}
      theme={theme}
      style={{ width: "100%", height: "100%" }}
      notMerge
      lazyUpdate
      className={className}
    />
  );
}
