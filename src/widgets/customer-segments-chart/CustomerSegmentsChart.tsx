"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockCustomerSegments } from "./mock";

/**
 * Customer Segments — donut, share of customer base by company size.
 *
 * WHY percent (not count) in mock:
 * Percentages tell the "mix" story without implying absolute scale. In
 * Pass 2 we can pass both count and percent; tooltip can show "X customers
 * (Y%)". For this pass, % alone reads fine.
 */

const option: ECOption = {
  tooltip: {
    trigger: "item",
    formatter: (params) => {
      const p = params as { name: string; value: number };
      return `${p.name}<br/><b>${p.value}%</b> of customers`;
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
      type: "pie",
      radius: ["50%", "72%"],
      center: ["50%", "44%"],
      avoidLabelOverlap: true,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: { borderRadius: 4, borderWidth: 2 },
      data: mockCustomerSegments.map((s) => ({
        name: s.segment,
        value: s.share,
      })),
    },
  ],
};

export function CustomerSegmentsChart() {
  return <Chart option={option} />;
}
