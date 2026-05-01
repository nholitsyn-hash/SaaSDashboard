"use client";

import { KpiCard } from "@/shared/ui";
import { useAnalytics, type AnalyticsKpi } from "@/entities/analytics";

/**
 * AnalyticsKpis — 4-card KPI band on the Analytics page.
 *
 * Reads from `useAnalytics()` (deduped with the chart widgets via
 * shared queryKey). Loading state shows "—" rather than a spinner so
 * the layout doesn't shift when data arrives.
 */

export function AnalyticsKpis() {
  const { data, isLoading } = useAnalytics();
  const kpis = data?.kpis;

  return (
    <section
      aria-label="Analytics KPIs"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KpiCard
        label="LTV"
        value={isLoading ? "—" : (kpis?.ltv.value ?? "—")}
        delta={kpis ? kpiToDelta(kpis.ltv) : undefined}
      />
      <KpiCard
        label="CAC"
        value={isLoading ? "—" : (kpis?.cac.value ?? "—")}
        delta={kpis ? kpiToDelta(kpis.cac) : undefined}
      />
      <KpiCard
        label="Payback"
        value={isLoading ? "—" : (kpis?.paybackMonths.value ?? "—")}
        delta={kpis ? kpiToDelta(kpis.paybackMonths) : undefined}
      />
      <KpiCard
        label="Net Revenue Retention"
        value={isLoading ? "—" : (kpis?.netRevenueRetention.value ?? "—")}
        delta={kpis ? kpiToDelta(kpis.netRevenueRetention) : undefined}
      />
    </section>
  );
}

function kpiToDelta(kpi: AnalyticsKpi) {
  return {
    value: kpi.delta,
    trend: kpi.trend,
    label: kpi.label,
  };
}
