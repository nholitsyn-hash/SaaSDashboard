"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockPlanRevenue } from "./mock";

/**
 * Revenue by Plan — donut chart.
 *
 * WHY donut (radius: [50%, 70%]) instead of pie:
 * Donuts read as "parts of a whole" with less visual clutter than solid
 * pies, and the center hole is a natural slot for a total label later.
 */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const option: ECOption = {
  tooltip: {
    trigger: "item",
    formatter: (params) => {
      const p = params as { name: string; value: number; percent: number };
      return `${p.name}<br/><b>${usd(p.value)}</b> (${p.percent}%)`;
    },
  },
  legend: {
    orient: "horizontal",
    bottom: 0,
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: "Revenue by plan",
      type: "pie",
      radius: ["50%", "72%"],
      center: ["50%", "44%"],
      avoidLabelOverlap: true,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: { borderRadius: 4, borderWidth: 2 },
      data: mockPlanRevenue.map((d) => ({ name: d.plan, value: d.value })),
    },
  ],
};

export function RevenueByPlanChart() {
  return <Chart option={option} />;
}
