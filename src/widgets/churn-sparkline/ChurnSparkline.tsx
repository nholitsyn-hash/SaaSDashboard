"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import { useDashboard } from "@/entities/dashboard";

function buildOption(values: number[]): ECOption {
  return {
    grid: { top: 2, right: 2, bottom: 2, left: 2, containLabel: false },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const arr = params as Array<{ value: number }>;
        return `${arr[0]?.value.toFixed(1) ?? "-"}%`;
      },
    },
    xAxis: {
      type: "category",
      show: false,
      boundaryGap: false,
      data: values.map((_, i) => i),
    },
    yAxis: { type: "value", show: false, scale: true },
    series: [
      {
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.2 },
        data: values,
      },
    ],
  };
}

export function ChurnSparkline() {
  const { data } = useDashboard();
  if (!data) return null;
  return <Chart option={buildOption(data.churnTrend)} />;
}
