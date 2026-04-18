"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockRegionRevenue } from "./mock";

/**
 * Revenue by Region — horizontal bar chart.
 *
 * WHY horizontal (yAxis = category) instead of vertical:
 * Region names are long; vertical bars would either wrap awkwardly or
 * need 45° tilted labels. Horizontal bars read left-to-right like text,
 * which is how users parse region names anyway.
 */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// Sorted ascending so the biggest region appears at the top (ECharts bar y-axis
// renders first category at bottom)
const sorted = [...mockRegionRevenue].sort((a, b) => a.value - b.value);

const option: ECOption = {
  grid: { top: 12, right: 24, bottom: 24, left: 110 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    valueFormatter: (v) => usd(v as number),
  },
  xAxis: {
    type: "value",
    axisLabel: {
      formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
    },
  },
  yAxis: {
    type: "category",
    data: sorted.map((d) => d.region),
  },
  series: [
    {
      name: "Revenue",
      type: "bar",
      data: sorted.map((d) => d.value),
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      barMaxWidth: 24,
    },
  ],
};

export function RevenueByRegionChart() {
  return <Chart option={option} />;
}
