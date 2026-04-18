"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockMrrMovement } from "./mock";

/**
 * MRR Movement — divergent stacked bar.
 *
 * WHY a single stack name for all four series:
 * ECharts stacks positive values upward from zero and negative values
 * downward from zero when they share a stack. So New/Expansion stack
 * above the axis, Contraction/Churn stack below — a clean divergent
 * visual without needing two separate stacks or a waterfall hack.
 *
 * WHY semantic colors (not theme palette cycle):
 * The four movement types have fixed emotional valence — new/expansion
 * are "good" (positive revenue), contraction/churn are "bad" (negative).
 * Binding them to theme cycle positions would assign colors arbitrarily;
 * hardcoding success/primary/warning/danger tells the story at a glance.
 *
 * Color choices tuned for dark+light parity: same hex values work in
 * both (all mid-saturation, not pure theme-dependent tokens).
 */

const usd = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US")}`;

const option: ECOption = {
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
    data: mockMrrMovement.map((r) => r.month),
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
      data: mockMrrMovement.map((r) => r.new),
      itemStyle: { color: "#22c55e", borderRadius: [2, 2, 0, 0] },
      barMaxWidth: 32,
    },
    {
      name: "Expansion",
      type: "bar",
      stack: "movement",
      data: mockMrrMovement.map((r) => r.expansion),
      itemStyle: { color: "#3b82f6" },
      barMaxWidth: 32,
    },
    {
      name: "Contraction",
      type: "bar",
      stack: "movement",
      data: mockMrrMovement.map((r) => r.contraction),
      itemStyle: { color: "#f59e0b" },
      barMaxWidth: 32,
    },
    {
      name: "Churn",
      type: "bar",
      stack: "movement",
      data: mockMrrMovement.map((r) => r.churn),
      itemStyle: { color: "#ef4444", borderRadius: [0, 0, 2, 2] },
      barMaxWidth: 32,
    },
  ],
};

export function MrrMovementChart() {
  return <Chart option={option} />;
}
