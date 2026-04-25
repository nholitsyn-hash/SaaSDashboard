"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard, type TimeseriesPoint } from "@/entities/dashboard";

function buildOption(series: TimeseriesPoint[]): ECOption {
  return {
    grid: { top: 16, right: 16, bottom: 32, left: 48 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => (v as number).toLocaleString("en-US"),
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: series.map((p) => p.date),
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
        formatter: (v: number) =>
          v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`,
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
        data: series.map((p) => p.value),
      },
    ],
  };
}

export function ActiveUsersChart() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.activeUsersTrend)} />;
}
