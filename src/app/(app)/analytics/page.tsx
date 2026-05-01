import { ChartCard } from "@/shared/ui";
import { AnalyticsHeader } from "@/widgets/analytics-header";
import { AnalyticsKpis } from "@/widgets/analytics-kpis";
import { CohortRetentionHeatmap } from "@/widgets/cohort-retention-heatmap";
import { MrrMovementChart } from "@/widgets/mrr-movement-chart";
import { LtvByPlanChart } from "@/widgets/ltv-by-plan-chart";
import { CustomerSegmentsChart } from "@/widgets/customer-segments-chart";

/**
 * Analytics — composes widgets that all consume `useAnalytics()`.
 * Page stays an RSC; each widget is its own client island and the
 * shared TanStack cache means one network request feeds them all.
 */
export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AnalyticsHeader />

        <AnalyticsKpis />

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
