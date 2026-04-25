"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard, type PlanRevenue } from "@/entities/dashboard";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function buildOption(rows: PlanRevenue[]): ECOption {
  return {
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
        data: rows.map((d) => ({ name: d.plan, value: d.value })),
      },
    ],
  };
}

export function RevenueByPlanChart() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.revenueByPlan)} />;
}
