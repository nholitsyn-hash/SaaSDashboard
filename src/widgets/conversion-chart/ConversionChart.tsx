"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard, type FunnelStage } from "@/entities/dashboard";

function buildOption(funnel: FunnelStage[]): ECOption {
  const topCount = funnel[0]?.count ?? 1;
  const labeled = funnel.map((stage, i) => {
    const prev = i === 0 ? stage.count : (funnel[i - 1]?.count ?? stage.count);
    const dropPct = i === 0 ? 100 : Math.round((stage.count / prev) * 100);
    const ofTotalPct = Math.round((stage.count / topCount) * 100);
    return { ...stage, dropPct, ofTotalPct };
  });

  return {
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
      inverse: true,
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
}

export function ConversionChart() {
  const { data, isLoading } = useDashboard();
  if (isLoading || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.conversionFunnel)} />;
}
