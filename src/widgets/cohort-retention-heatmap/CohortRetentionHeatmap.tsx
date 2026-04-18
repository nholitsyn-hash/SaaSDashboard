"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockCohorts, COHORT_MONTH_LABELS } from "./mock";

/**
 * Cohort retention heatmap — the defining SaaS analytics visualization.
 *
 * WHY the diagonal gap (empty cells bottom-right):
 * Newer cohorts haven't lived long enough to report later months. We
 * express that as `null` in the mock and skip the cell entirely — better
 * than showing 0% which would lie (those users aren't churned, they're
 * "not yet observable"). ECharts heatmap tolerates a missing [x, y] tuple.
 *
 * WHY a gradient visualMap (instead of discrete bands):
 * Retention is continuous — a cell reading 62% shouldn't look identical
 * to 68%. Gradient color preserves the precision. We anchor min=30,
 * max=100 so the lowest realistic value still reads as "bad" (light) and
 * the highest as "excellent" (dark).
 *
 * WHY rich-text label color depending on value:
 * Cell backgrounds range from very light blue (low retention) to dark
 * primary (high). A single label color can't stay legible across that
 * range. Using `rich` styles, we pick white on dark cells (v > 55) and
 * near-black on light cells — no theme branch needed, works in both.
 */

type HeatmapPoint = [xIndex: number, yIndex: number, value: number];

const heatmapData: HeatmapPoint[] = [];
mockCohorts.forEach((row, y) => {
  row.retention.forEach((val, x) => {
    if (val !== null) heatmapData.push([x, y, val]);
  });
});

const option: ECOption = {
  grid: { top: 16, right: 16, bottom: 56, left: 72 },
  tooltip: {
    position: "top",
    formatter: (params) => {
      // ECharts types `params` as a broad union; at runtime on a heatmap
      // item trigger it's always `{ value: [x, y, v] }`.
      const p = params as unknown as { value: HeatmapPoint };
      const [x, y, value] = p.value;
      const cohort = mockCohorts[y]?.cohort ?? "";
      return `${cohort} · ${COHORT_MONTH_LABELS[x]}<br/><b>${value}%</b> retained`;
    },
  },
  xAxis: {
    type: "category",
    data: COHORT_MONTH_LABELS,
    position: "top",
    splitArea: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  yAxis: {
    type: "category",
    data: mockCohorts.map((c) => c.cohort),
    inverse: true,
    splitArea: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  visualMap: {
    min: 30,
    max: 100,
    show: false,
    inRange: {
      // Light-to-dark blue; works on both surfaces.
      color: ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"],
    },
  },
  series: [
    {
      type: "heatmap",
      data: heatmapData,
      label: {
        show: true,
        formatter: (params) => {
          const p = params as unknown as { value: HeatmapPoint };
          const v = p.value[2];
          const styleKey = v > 55 ? "hi" : "lo";
          return `{${styleKey}|${v}%}`;
        },
        rich: {
          hi: { color: "#ffffff", fontSize: 11, fontWeight: 500 },
          lo: { color: "#1e293b", fontSize: 11, fontWeight: 500 },
        },
      },
      itemStyle: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "transparent",
      },
      emphasis: {
        itemStyle: {
          borderColor: "#0f172a",
          borderWidth: 2,
        },
      },
    },
  ],
};

export function CohortRetentionHeatmap() {
  return <Chart option={option} />;
}
