"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockActiveUsers } from "./mock";

/**
 * Active Users — area chart (line + areaStyle).
 *
 * WHY `areaStyle` instead of a dedicated area series type:
 * ECharts has no "area" type — it's a line with `areaStyle` enabled.
 * One less primitive to register, and you can toggle fill independently.
 */

const option: ECOption = {
  grid: { top: 16, right: 16, bottom: 32, left: 48 },
  tooltip: {
    trigger: "axis",
    valueFormatter: (v) => (v as number).toLocaleString("en-US"),
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: mockActiveUsers.map((p) => p.date),
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
      formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`),
    },
  },
  series: [
    {
      name: "Active users",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2 },
      areaStyle: { opacity: 0.25 },
      data: mockActiveUsers.map((p) => p.count),
    },
  ],
};

export function ActiveUsersChart() {
  return <Chart option={option} />;
}
