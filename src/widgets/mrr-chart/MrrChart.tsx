"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockMrrSeries } from "./mock";

/**
 * MRR chart — smooth line, last 30 days of USD MRR.
 *
 * WHY option is module-scope (not useMemo-d in the component):
 * The data reference is static; building the option once per module load
 * is cheaper than per-render, and `notMerge` on the Chart wrapper means
 * ECharts doesn't care if we pass the same reference repeatedly.
 */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const option: ECOption = {
  grid: { top: 16, right: 16, bottom: 32, left: 56 },
  tooltip: {
    trigger: "axis",
    valueFormatter: (v) => usd(v as number),
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: mockMrrSeries.map((p) => p.date),
    axisLabel: {
      formatter: (value: string) => {
        const d = new Date(value);
        return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
      },
      interval: 4,
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
    },
  },
  series: [
    {
      name: "MRR",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.08 },
      data: mockMrrSeries.map((p) => p.value),
    },
  ],
};

export function MrrChart() {
  return <Chart option={option} />;
}
