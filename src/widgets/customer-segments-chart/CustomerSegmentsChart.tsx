"use client";

import { Chart } from "@/shared/ui";
import type { ECOption } from "@/shared/config";
import {
  useAnalytics,
  type CustomerSegment,
} from "@/entities/analytics";

const usd = (v: number) => `${v}%`;
void usd;

function buildOption(segments: CustomerSegment[]): ECOption {
  return {
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
        data: segments.map((s) => ({ name: s.segment, value: s.share })),
      },
    ],
  };
}

export function CustomerSegmentsChart() {
  const { data } = useAnalytics();
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
        Loading…
      </div>
    );
  }
  return <Chart option={buildOption(data.customerSegments)} />;
}
