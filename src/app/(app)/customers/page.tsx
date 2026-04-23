import { UserPlus } from "lucide-react";
import { Typography } from "@/shared/ui";
import { CustomersKpis, CustomersList } from "@/widgets/customers-list";

/**
 * Customers — directory of all customer accounts (live data).
 * Page stays an RSC; KPIs and list are independent client islands
 * that share the `useCustomers()` cache via TanStack Query dedup.
 */
export default function CustomersPage() {
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

        <CustomersKpis />
        <CustomersList />
      </div>
    </div>
  );
}
