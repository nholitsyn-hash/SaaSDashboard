"use client";

import { KpiCard } from "@/shared/ui";
import { useDashboard } from "@/entities/dashboard";
import { ChurnSparkline } from "@/widgets/churn-sparkline";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const fmtPct = (delta: number | undefined): string =>
  delta === undefined
    ? "—"
    : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;

const fmtPp = (delta: number | undefined): string =>
  delta === undefined
    ? "—"
    : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}pp`;

/** Trend "up" means good outcome, regardless of sign. Churn-down = good = up. */
function deltaPctTrend(value: number | undefined): "up" | "down" | "neutral" {
  if (value === undefined || value === 0) return "neutral";
  return value > 0 ? "up" : "down";
}
function deltaChurnTrend(value: number | undefined): "up" | "down" | "neutral" {
  if (value === undefined || value === 0) return "neutral";
  // Negative churn delta = decreasing churn = good = up.
  return value < 0 ? "up" : "down";
}

export function DashboardKpis() {
  const { data, isLoading } = useDashboard();
  const kpis = data?.kpis;

  const value = (n: number | undefined, format: (v: number) => string) =>
    isLoading || n === undefined ? "—" : format(n);

  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KpiCard
        label="MRR"
        value={value(kpis?.mrr.value, usd)}
        delta={
          isLoading
            ? undefined
            : {
                value: fmtPct(kpis?.mrr.deltaPct),
                trend: deltaPctTrend(kpis?.mrr.deltaPct),
                label: "vs last month",
              }
        }
      />
      <KpiCard
        label="Active Users"
        value={value(kpis?.activeUsers.value, (n) => n.toLocaleString("en-US"))}
        delta={
          isLoading
            ? undefined
            : {
                value: fmtPct(kpis?.activeUsers.deltaPct),
                trend: deltaPctTrend(kpis?.activeUsers.deltaPct),
                label: "vs last month",
              }
        }
      />
      <KpiCard
        label="Churn Rate"
        value={value(kpis?.churnRate.value, (n) => `${n.toFixed(1)}%`)}
        delta={
          isLoading
            ? undefined
            : {
                value: fmtPp(kpis?.churnRate.deltaPp),
                trend: deltaChurnTrend(kpis?.churnRate.deltaPp),
                label: "vs last month",
              }
        }
        sparkline={data ? <ChurnSparkline /> : undefined}
      />
      <KpiCard
        label="Trial → Paid"
        value={value(kpis?.conversion.value, (n) => `${n.toFixed(1)}%`)}
        delta={
          isLoading
            ? undefined
            : {
                value: fmtPp(kpis?.conversion.deltaPp),
                trend: deltaPctTrend(kpis?.conversion.deltaPp),
                label: "vs last month",
              }
        }
      />
    </section>
  );
}
