"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  DataTable,
  DateRangePicker,
  Input,
  type Column,
  type DatePreset,
} from "@/shared/ui";
import {
  mockSubscriptions,
  type SubPlan,
  type SubStatus,
  type Subscription,
} from "./mock";

/**
 * SubscriptionsList — filterable subscription directory.
 *
 * WHY filter-bar above the table (not tabs):
 * Subscription queries usually combine multiple dimensions (plan + status
 * + date range). Tabs work for single-dimension segmentation (Customers
 * → lifecycle state) but become crowded with two dimensions. A classic
 * filter bar scales better.
 *
 * Pass 1 filters are visual — DateRangePicker doesn't yet drive the rows,
 * search does. Wiring the range + plan/status selects is Pass 2.
 */

const planVariant: Record<SubPlan, "primary" | "secondary"> = {
  Pro: "primary",
  Enterprise: "secondary",
};

const statusVariant: Record<SubStatus, "success" | "warning" | "default" | "danger"> = {
  active: "success",
  trial: "warning",
  paused: "default",
  canceled: "danger",
};

const usd = (n: number) =>
  n === 0 ? "—" : `$${n.toLocaleString("en-US")}`;

const columns: Column<Subscription>[] = [
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    render: (row) => (
      <span className="font-medium text-text-primary">{row.customer}</span>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Badge variant={planVariant[row.plan]}>{row.plan}</Badge>
        <span className="text-xs text-text-tertiary capitalize">
          {row.cycle}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  {
    key: "mrr",
    header: "MRR",
    sortable: true,
    align: "right",
    render: (row) => (
      <span className="tabular-nums font-medium">{usd(row.mrr)}</span>
    ),
  },
  {
    key: "startedAt",
    header: "Started",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-text-secondary">{row.startedAt}</span>
    ),
  },
  {
    key: "renewsAt",
    header: "Renews",
    align: "right",
    render: (row) => (
      <span className="tabular-nums text-text-secondary">{row.renewsAt}</span>
    ),
  },
];

export function SubscriptionsList() {
  const [range, setRange] = useState<DatePreset>("30d");
  const [search, setSearch] = useState("");

  const visibleRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return mockSubscriptions;
    return mockSubscriptions.filter((s) =>
      s.customer.toLowerCase().includes(normalized)
    );
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <DateRangePicker value={range} onChange={setRange} />
        <div className="ml-auto w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable<Subscription>
        columns={columns}
        rows={visibleRows}
        getRowKey={(row) => row.id}
        pagination={{
          page: 1,
          pageSize: visibleRows.length || 1,
          total: visibleRows.length,
        }}
        emptyState={
          search
            ? `No subscriptions match "${search}"`
            : "No subscriptions found"
        }
      />
    </div>
  );
}
