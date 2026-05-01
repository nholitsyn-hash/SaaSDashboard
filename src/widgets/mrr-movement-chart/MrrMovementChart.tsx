"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import {
  useAnalytics,
  type MrrMovementRow,
} from "@/entities/analytics";

/**
 * MRR Movement — divergent stacked bar.
 *
 * WHY single stack name for all four series:
 *   ECharts stacks positive values up from zero and negatives down from
 *   zero when they share a stack — clean divergent visual without two
 *   separate stacks or a waterfall hack.
 *
 * WHY semantic colors (not the theme palette cycle):
 *   New/Expansion are "good", Contraction/Churn are "bad". Binding to
 *   theme cycle would assign colors arbitrarily; hex semantic colors
 *   tell the story at a glance and read identically in light + dark mode.
 */

const usd = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`;

function buildOption(rows: MrrMovementRow[]): ECOption {
  return {
    grid: { top: 32, right: 16, bottom: 40, left: 64 },
    legend: {
      top: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { fontSize: 11 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (v) => usd(v as number),
    },
    xAxis: {
      type: "category",
      data: rows.map((r) => r.month),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        name: "New",
        type: "bar",
        stack: "movement",
        data: rows.map((r) => r.new),
        itemStyle: { color: "#22c55e", borderRadius: [2, 2, 0, 0] },
        barMaxWidth: 32,
      },
      {
        name: "Expansion",
        type: "bar",
        stack: "movement",
        data: rows.map((r) => r.expansion),
        itemStyle: { color: "#3b82f6" },
        barMaxWidth: 32,
      },
      {
        name: "Contraction",
        type: "bar",
        stack: "movement",
        data: rows.map((r) => r.contraction),
        itemStyle: { color: "#f59e0b" },
        barMaxWidth: 32,
      },
      {
        name: "Churn",
        type: "bar",
        stack: "movement",
        data: rows.map((r) => r.churn),
        itemStyle: { color: "#ef4444", borderRadius: [0, 0, 2, 2] },
        barMaxWidth: 32,
      },
    ],
  };
}

export function MrrMovementChart() {
  const { data } = useAnalytics();
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.mrrMovement)} />;
}
