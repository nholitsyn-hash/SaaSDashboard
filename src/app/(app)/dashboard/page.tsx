import { ChartCard, Typography } from "@/shared/ui";
import { DashboardKpis } from "@/widgets/dashboard-kpis";
import { MrrChart } from "@/widgets/mrr-chart";
import { ActiveUsersChart } from "@/widgets/active-users-chart";
import { RevenueByPlanChart } from "@/widgets/revenue-by-plan-chart";
import { RevenueByRegionChart } from "@/widgets/revenue-by-region-chart";
import { ConversionChart } from "@/widgets/conversion-chart";
import { RecentSignupsTable } from "@/widgets/recent-signups-table";

/**
 * Dashboard — composes widgets that all consume `useDashboard()`.
 * Page stays an RSC; each widget is its own client island and the
 * shared TanStack cache means one network request feeds them all.
 */
export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Dashboard</Typography>
          <Typography variant="body-sm">SaaS performance overview</Typography>
        </header>

        <DashboardKpis />

        <section
          aria-label="Revenue and usage trends"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <ChartCard title="Monthly Recurring Revenue" subtitle="Last 30 days">
            <MrrChart />
          </ChartCard>
          <ChartCard title="Active Users" subtitle="Daily, last 30 days">
            <ActiveUsersChart />
          </ChartCard>
        </section>

        <section
          aria-label="Breakdowns"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          <ChartCard title="Revenue by Plan" subtitle="Current month">
            <RevenueByPlanChart />
          </ChartCard>
          <ChartCard title="Revenue by Region" subtitle="Current month">
            <RevenueByRegionChart />
          </ChartCard>
          <ChartCard
            title="Trial → Paid Conversion"
            subtitle="Current period"
            className="md:col-span-2 xl:col-span-1"
          >
            <ConversionChart />
          </ChartCard>
        </section>

        <section aria-label="Recent signups">
          <RecentSignupsTable />
        </section>
      </div>
    </div>
  );
}
