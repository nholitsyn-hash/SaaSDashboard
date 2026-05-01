"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useAnalytics, type PlanLtv } from "@/entities/analytics";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function buildOption(rows: PlanLtv[]): ECOption {
  // Ascending so the categoryAxis renders the biggest at the top.
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  return {
    grid: { top: 16, right: 56, bottom: 24, left: 88 },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => usd(v as number),
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) =>
          v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`,
      },
    },
    yAxis: {
      type: "category",
      data: sorted.map((d) => d.plan),
    },
    series: [
      {
        type: "bar",
        data: sorted.map((d) => d.value),
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        barMaxWidth: 24,
        label: {
          show: true,
          position: "right",
          formatter: (params) => {
            const p = params as { value: number };
            return usd(p.value);
          },
        },
      },
    ],
  };
}

export function LtvByPlanChart() {
  const { data } = useAnalytics();
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.ltvByPlan)} />;
}
