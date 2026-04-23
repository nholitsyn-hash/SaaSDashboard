import { KpiCard, Typography } from "@/shared/ui";
import { SubscriptionsList } from "@/widgets/subscriptions-list";
import { subscriptionKpis } from "@/widgets/subscriptions-list/mock";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function SubscriptionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Subscriptions</Typography>
          <Typography variant="body-sm">
            Every subscription contract — active, trial, paused, and canceled
          </Typography>
        </header>

        <section
          aria-label="Subscription KPIs"
          className="grid grid-cols-2 gap-4 xl:grid-cols-4"
        >
          <KpiCard
            label="Active"
            value={subscriptionKpis.active}
            delta={{ value: "+4", trend: "up", label: "this month" }}
          />
          <KpiCard
            label="Total MRR"
            value={usd(subscriptionKpis.mrr)}
            delta={{ value: "+12.4%", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="ARPU"
            value={usd(subscriptionKpis.arpu)}
            delta={{ value: "+$42", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="Net new"
            value={subscriptionKpis.netNew}
            delta={{ value: "+2", trend: "up", label: "vs last month" }}
          />
        </section>

        <SubscriptionsList />
      </div>
    </div>
  );
}
