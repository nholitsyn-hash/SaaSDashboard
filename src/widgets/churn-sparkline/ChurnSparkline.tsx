"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockChurnSparkline } from "./mock";

/**
 * Churn sparkline — tiny inline line chart for the Churn KpiCard.
 *
 * WHY every axis/grid piece is hidden:
 * Sparklines are decorative trend indicators, not full charts. Removing
 * axes, gridlines, padding, and tick labels lets the shape fit in a 32px
 * tall slot without cropping. The card's label/value already provides
 * context; the sparkline just communicates direction at a glance.
 */

const option: ECOption = {
  grid: { top: 2, right: 2, bottom: 2, left: 2, containLabel: false },
  tooltip: {
    trigger: "axis",
    formatter: (params) => {
      const arr = params as Array<{ value: number }>;
      return `${arr[0]?.value.toFixed(1) ?? "-"}%`;
    },
  },
  xAxis: {
    type: "category",
    show: false,
    boundaryGap: false,
    data: mockChurnSparkline.map((_, i) => i),
  },
  yAxis: { type: "value", show: false, scale: true },
  series: [
    {
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.2 },
      data: mockChurnSparkline,
    },
  ],
};

export function ChurnSparkline() {
  return <Chart option={option} />;
}
