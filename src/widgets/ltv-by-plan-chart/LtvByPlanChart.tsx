"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockPlanLtv } from "./mock";

/**
 * LTV by Plan — horizontal bar, logarithmic-feeling values.
 *
 * WHY horizontal (yAxis = category) not vertical:
 * Free LTV is $22; Enterprise is $8,750 — a 400× spread. In a vertical
 * bar chart the Free bar would be invisible. Horizontal still looks odd
 * (Free is a sliver) but at least the labels always render full-width,
 * and the visual gulf between tiers IS the story — demonstrates why
 * Enterprise customers get white-glove attention.
 *
 * WHY sorted ascending (Enterprise at top):
 * Biggest value rendered at the top of the chart (y-axis is inverted by
 * default when inverse is unspecified for category axes, so listing data
 * low-to-high puts smallest at top — we reverse the mock order to
 * correct it).
 */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

// Ascending so categoryAxis renders biggest at top.
const sorted = [...mockPlanLtv].sort((a, b) => a.value - b.value);

const option: ECOption = {
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

export function LtvByPlanChart() {
  return <Chart option={option} />;
}
