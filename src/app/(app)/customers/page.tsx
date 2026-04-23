import { UserPlus } from "lucide-react";
import { KpiCard, Typography } from "@/shared/ui";
import { CustomersList } from "@/widgets/customers-list";
import { customerStatusCounts } from "@/widgets/customers-list/mock";

/**
 * Customers — directory of all customer accounts.
 * Page is RSC; the tabbed list is a client island.
 */
export default function CustomersPage() {
  const kpis = {
    total: customerStatusCounts.all,
    active: customerStatusCounts.active,
    trial: customerStatusCounts.trial,
    churned: customerStatusCounts.churned,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <Typography variant="h2">Customers</Typography>
            <Typography variant="body-sm">
              Every account in your workspace, filterable by lifecycle state
            </Typography>
          </div>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="
              inline-flex items-center gap-2
              rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
              shadow-sm transition-opacity
              disabled:opacity-60 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus focus-visible:ring-offset-2
            "
          >
            <UserPlus size={14} />
            Add customer
          </button>
        </header>

        <section
          aria-label="Customer KPIs"
          className="grid grid-cols-2 gap-4 xl:grid-cols-4"
        >
          <KpiCard label="Total Customers" value={kpis.total} />
          <KpiCard
            label="Active"
            value={kpis.active}
            delta={{ value: "+3", trend: "up", label: "this month" }}
          />
          <KpiCard
            label="Trial"
            value={kpis.trial}
            delta={{ value: "+1", trend: "up", label: "this week" }}
          />
          <KpiCard
            label="Churned"
            value={kpis.churned}
            delta={{ value: "-1", trend: "up", label: "vs last month" }}
          />
        </section>

        <CustomersList />
      </div>
    </div>
  );
}
