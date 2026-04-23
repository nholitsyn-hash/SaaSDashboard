"use client";

import { KpiCard } from "@/shared/ui";
import { useCustomers } from "@/entities/customer";

/**
 * CustomersKpis — summary counts for the Customers page header.
 *
 * WHY this is a sibling of CustomersList (not merged):
 * Each consumer has its own responsibility. Keeping KPIs separate
 * means the page-level grid can stay RSC (no need to turn the whole
 * page into a client component for this one row).
 *
 * WHY no separate query:
 * `useCustomers()` dedupes — two components, one cached array, one
 * network request. The KPI row just derives counts from that array.
 * If we ever introduce a dedicated /api/customers/stats endpoint for
 * scale, swap this hook to `useCustomerStats()` in one place.
 */
export function CustomersKpis() {
  const { data, isLoading } = useCustomers();

  const customers = data ?? [];

  const total = customers.length;
  const active = customers.filter((c) => c.status === "active").length;
  const trial = customers.filter((c) => c.status === "trial").length;
  const churned = customers.filter((c) => c.status === "churned").length;

  const displayValue = (n: number) => (isLoading ? "—" : n);

  return (
    <section
      aria-label="Customer KPIs"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      <KpiCard label="Total Customers" value={displayValue(total)} />
      <KpiCard
        label="Active"
        value={displayValue(active)}
        delta={
          isLoading
            ? undefined
            : { value: "+3", trend: "up", label: "this month" }
        }
      />
      <KpiCard
        label="Trial"
        value={displayValue(trial)}
        delta={
          isLoading
            ? undefined
            : { value: "+1", trend: "up", label: "this week" }
        }
      />
      <KpiCard
        label="Churned"
        value={displayValue(churned)}
        delta={
          isLoading
            ? undefined
            : { value: "-1", trend: "up", label: "vs last month" }
        }
      />
    </section>
  );
}
