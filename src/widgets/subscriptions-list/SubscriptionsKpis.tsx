"use client";

import { KpiCard } from "@/shared/ui";
import { useSubscriptions } from "@/entities/subscription";

/**
 * SubscriptionsKpis — active count, total MRR, ARPU, net-new.
 *
 * WHY derive here (not a separate /api/subscriptions/stats):
 *   With < 1k subs, client-side reduce is free. A dedicated stats
 *   endpoint makes sense when totals become expensive to compute or
 *   when we want them to refresh independently from the list. For
 *   today's scale, one endpoint feeds both.
 */

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export function SubscriptionsKpis() {
  const { data, isLoading } = useSubscriptions();

  const subs = data ?? [];
  const active = subs.filter((s) => s.status === "active").length;
  const mrr = subs.reduce((sum, s) => sum + s.mrr, 0);
  const arpu = active > 0 ? Math.round(mrr / active) : 0;

  const displayNumber = (n: number) => (isLoading ? "—" : n);
  const displayUsd = (n: number) => (isLoading ? "—" : usd(n));

  return (
    <section
      aria-label="Subscription KPIs"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      <KpiCard
        label="Active"
        value={displayNumber(active)}
        delta={
          isLoading
            ? undefined
            : { value: "+4", trend: "up", label: "this month" }
        }
      />
      <KpiCard
        label="Total MRR"
        value={displayUsd(mrr)}
        delta={
          isLoading
            ? undefined
            : { value: "+12.4%", trend: "up", label: "vs last month" }
        }
      />
      <KpiCard
        label="ARPU"
        value={displayUsd(arpu)}
        delta={
          isLoading
            ? undefined
            : { value: "+$42", trend: "up", label: "vs last month" }
        }
      />
      <KpiCard
        label="Net new"
        value={isLoading ? "—" : 4}
        delta={
          isLoading
            ? undefined
            : { value: "+2", trend: "up", label: "vs last month" }
        }
      />
    </section>
  );
}
