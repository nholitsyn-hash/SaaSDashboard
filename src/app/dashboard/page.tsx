import { auth } from "@/shared/api/auth";
import { ChartCard, KpiCard, ThemeToggle, Typography } from "@/shared/ui";
import { MrrChart } from "@/widgets/mrr-chart";
import { ActiveUsersChart } from "@/widgets/active-users-chart";
import { RevenueByPlanChart } from "@/widgets/revenue-by-plan-chart";
import { RevenueByRegionChart } from "@/widgets/revenue-by-region-chart";
import { ConversionChart } from "@/widgets/conversion-chart";
import { ChurnSparkline } from "@/widgets/churn-sparkline";
import { RecentSignupsTable } from "@/widgets/recent-signups-table";
import { redirect } from "next/navigation";

/**
 * Dashboard — Phase 3, Step 4.
 * Page composes widgets only; all mock data and column defs live inside widgets.
 * Step 5 will finalize the responsive grid and verify desktop/laptop/mobile.
 */

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg-base p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="body-sm">
              SaaS performance overview — {session.user.name ?? session.user.email}
            </Typography>
          </div>
          <ThemeToggle />
        </header>

        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <KpiCard
            label="MRR"
            value="$48,250"
            delta={{ value: "+12.4%", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="Active Users"
            value="2,184"
            delta={{ value: "+5.1%", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="Churn Rate"
            value="3.2%"
            delta={{ value: "-0.6%", trend: "down", label: "vs last month" }}
            sparkline={<ChurnSparkline />}
          />
          <KpiCard
            label="Trial → Paid"
            value="27.8%"
            delta={{ value: "+2.1%", trend: "up", label: "vs last month" }}
          />
        </section>

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
    </main>
  );
}
