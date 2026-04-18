import { ChartCard, KpiCard } from "@/shared/ui";
import { AnalyticsHeader } from "@/widgets/analytics-header";
import { CohortRetentionHeatmap } from "@/widgets/cohort-retention-heatmap";
import { MrrMovementChart } from "@/widgets/mrr-movement-chart";
import { LtvByPlanChart } from "@/widgets/ltv-by-plan-chart";
import { CustomerSegmentsChart } from "@/widgets/customer-segments-chart";

/**
 * Analytics — deep SaaS metrics (Phase 4, Step 3).
 *
 * Composition only. Page is an RSC; the interactive header is a client
 * widget and every chart is its own client widget.
 */
export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AnalyticsHeader />

        <section
          aria-label="Analytics KPIs"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <KpiCard
            label="LTV"
            value="$1,240"
            delta={{ value: "+8.3%", trend: "up", label: "vs last 30d" }}
          />
          <KpiCard
            label="CAC"
            value="$412"
            delta={{
              value: "-6.2%",
              // CAC going down is good → up-trend color.
              trend: "up",
              label: "vs last 30d",
            }}
          />
          <KpiCard
            label="Payback"
            value="3.2 mo"
            delta={{ value: "-0.4 mo", trend: "up", label: "vs last 30d" }}
          />
          <KpiCard
            label="Net Revenue Retention"
            value="112%"
            delta={{ value: "+4.1pp", trend: "up", label: "vs last 30d" }}
          />
        </section>

        <section aria-label="Cohort retention">
          <ChartCard
            title="Cohort Retention"
            subtitle="% of each monthly cohort still active, by month after signup"
            height={420}
          >
            <CohortRetentionHeatmap />
          </ChartCard>
        </section>

        <section
          aria-label="Revenue movement and plan breakdown"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <ChartCard
            title="MRR Movement"
            subtitle="New, expansion, contraction, churn — last 6 months"
          >
            <MrrMovementChart />
          </ChartCard>
          <ChartCard
            title="LTV by Plan"
            subtitle="Average lifetime value per subscriber"
          >
            <LtvByPlanChart />
          </ChartCard>
        </section>

        <section
          aria-label="Customer segmentation"
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <ChartCard
            title="Customer Segments"
            subtitle="Share of customer base by company size"
            className="lg:col-span-1"
          >
            <CustomerSegmentsChart />
          </ChartCard>
          <div
            className="hidden lg:block lg:col-span-2"
            aria-hidden
          />
        </section>
      </div>
    </div>
  );
}
