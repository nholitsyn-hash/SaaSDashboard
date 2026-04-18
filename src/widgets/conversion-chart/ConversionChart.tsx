"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { mockConversionFunnel } from "./mock";

/**
 * Trial → Paid Conversion — horizontal bar.
 *
 * WHY bar instead of ECharts' `funnel` type:
 * We haven't registered the funnel chart (not in `echarts.use([...])`).
 * A horizontal bar with labels reads the same and keeps the bundle small.
 * If we ever want the classic trapezoid funnel shape we can add it later.
 *
 * WHY conversion % label instead of raw count only:
 * The interesting signal is drop-off rate, not absolute numbers. Showing
 * "1,820 (17% of prev)" makes the funnel comparable across time periods.
 */

const topCount = mockConversionFunnel[0]?.count ?? 1;

const labeled = mockConversionFunnel.map((stage, i) => {
  const prev = i === 0 ? stage.count : mockConversionFunnel[i - 1].count;
  const dropPct = i === 0 ? 100 : Math.round((stage.count / prev) * 100);
  const ofTotalPct = Math.round((stage.count / topCount) * 100);
  return { ...stage, dropPct, ofTotalPct };
});

const option: ECOption = {
  grid: { top: 12, right: 80, bottom: 24, left: 84 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
    formatter: (params) => {
      const arr = params as Array<{ dataIndex: number }>;
      const idx = arr[0]?.dataIndex ?? 0;
      const s = labeled[idx];
      return `${s.stage}<br/><b>${s.count.toLocaleString("en-US")}</b> (${s.ofTotalPct}% of visitors)`;
    },
  },
  xAxis: { type: "value", show: false },
  yAxis: {
    type: "category",
    data: labeled.map((s) => s.stage),
    inverse: true, // Visitors at top, Paid at bottom
  },
  series: [
    {
      name: "Count",
      type: "bar",
      data: labeled.map((s) => s.count),
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      barMaxWidth: 24,
      label: {
        show: true,
        position: "right",
        formatter: (params) => {
          const p = params as { dataIndex: number };
          const s = labeled[p.dataIndex];
          return `${s.count.toLocaleString("en-US")}`;
        },
      },
    },
  ],
};

export function ConversionChart() {
  return <Chart option={option} />;
}
