"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import {
  useAnalytics,
  type CohortRetention,
} from "@/entities/analytics";

/**
 * Cohort retention heatmap — the defining SaaS analytics visualization.
 *
 * Same null-cell-skip + visualMap gradient + rich-text label-color logic
 * as the inline-mock version; data now comes from `useAnalytics()`.
 */

type HeatmapPoint = [xIndex: number, yIndex: number, value: number];

function buildOption(retention: CohortRetention): ECOption {
  const heatmapData: HeatmapPoint[] = [];
  retention.cohorts.forEach((row, y) => {
    row.retention.forEach((val, x) => {
      if (val !== null) heatmapData.push([x, y, val]);
    });
  });

  return {
    grid: { top: 16, right: 16, bottom: 56, left: 72 },
    tooltip: {
      position: "top",
      formatter: (params) => {
        const p = params as unknown as { value: HeatmapPoint };
        const [x, y, value] = p.value;
        const cohort = retention.cohorts[y]?.cohort ?? "";
        return `${cohort} · ${retention.monthLabels[x]}<br/><b>${value}%</b> retained`;
      },
    },
    xAxis: {
      type: "category",
      data: retention.monthLabels,
      position: "top",
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "category",
      data: retention.cohorts.map((c) => c.cohort),
      inverse: true,
      splitArea: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    visualMap: {
      min: 30,
      max: 100,
      show: false,
      inRange: {
        color: ["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"],
      },
    },
    series: [
      {
        type: "heatmap",
        data: heatmapData,
        label: {
          show: true,
          formatter: (params) => {
            const p = params as unknown as { value: HeatmapPoint };
            const v = p.value[2];
            const styleKey = v > 55 ? "hi" : "lo";
            return `{${styleKey}|${v}%}`;
          },
          rich: {
            hi: { color: "#ffffff", fontSize: 11, fontWeight: 500 },
            lo: { color: "#1e293b", fontSize: 11, fontWeight: 500 },
          },
        },
        itemStyle: {
          borderRadius: 4,
          borderWidth: 2,
          borderColor: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "#0f172a",
            borderWidth: 2,
          },
        },
      },
    ],
  };
}

export function CohortRetentionHeatmap() {
  const { data } = useAnalytics();
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.cohortRetention)} />;
}
