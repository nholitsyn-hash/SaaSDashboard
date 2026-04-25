"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard, type TimeseriesPoint } from "@/entities/dashboard";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function buildOption(series: TimeseriesPoint[]): ECOption {
  return {
    grid: { top: 16, right: 16, bottom: 32, left: 56 },
    tooltip: {
      trigger: "axis",
      valueFormatter: (v) => usd(v as number),
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
        data: series.map((p) => p.value),
      },
    ],
  };
}

export function MrrChart() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.mrrTrend)} />;
}
