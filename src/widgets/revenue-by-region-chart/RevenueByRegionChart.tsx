"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard, type RegionRevenue } from "@/entities/dashboard";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function buildOption(rows: RegionRevenue[]): ECOption {
  // Sort ascending so the biggest region appears at the top — ECharts bar
  // yAxis renders the first category at the bottom by default.
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  return {
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
}

export function RevenueByRegionChart() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.revenueByRegion)} />;
}
