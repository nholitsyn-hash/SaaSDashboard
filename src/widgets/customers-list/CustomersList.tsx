"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  DataTable,
  Input,
  Tabs,
  type Column,
} from "@/shared/ui";
import {
  useCustomers,
  type Customer,
  type CustomerPlan,
  type CustomerStatus,
} from "@/entities/customer";

/**
 * CustomersList — tabbed, searchable customer directory (live data).
 *
 * WHY still-client-side search/filter despite real data now:
 * Pagination + server-side filtering land when we have enough rows
 * to warrant them (hundreds). With ~20 rows, client filtering is
 * instant and keeps the URL clean. When volume grows, we swap
 * `.filter()` for query params + server where clauses — the API
 * shape stays the same.
 *
 * WHY one hook invocation here (not lifted to the page):
 * The parent `CustomersKpis` also calls `useCustomers()`. TanStack
 * Query dedupes identical queryKeys — two consumers, ONE network
 * request, ONE cache entry. Sharing via props would force a client
 * page wrapper; this is cleaner.
 */

const planVariant: Record<CustomerPlan, "default" | "primary" | "secondary"> = {
  Free: "default",
  Pro: "primary",
  Enterprise: "secondary",
};

const statusVariant: Record<
  CustomerStatus,
  "success" | "warning" | "danger"
> = {
  active: "success",
  trial: "warning",
  churned: "danger",
};

const usd = (n: number) =>
  n === 0 ? "—" : `$${n.toLocaleString("en-US")}`;

const columns: Column<Customer>[] = [
  {
    key: "company",
    header: "Company",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{row.company}</span>
        <span className="text-xs text-text-tertiary">
          {row.contact} · {row.email}
        </span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (row) => <Badge variant={planVariant[row.plan]}>{row.plan}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
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
    key: "region",
    header: "Region",
    render: (row) => (
      <span className="text-text-secondary">{row.region}</span>
    ),
  },
  {
    key: "joinedAt",
    header: "Joined",
    sortable: true,
    align: "right",
    render: (row) => <span className="tabular-nums">{row.joinedAt}</span>,
  },
];

type TabKey = "all" | CustomerStatus;

export function CustomersList() {
  const { data, isLoading, isError, error, refetch } = useCustomers();
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const allCustomers = data ?? [];

  const counts = useMemo(
    () => ({
      all: allCustomers.length,
      active: allCustomers.filter((c) => c.status === "active").length,
      trial: allCustomers.filter((c) => c.status === "trial").length,
      churned: allCustomers.filter((c) => c.status === "churned").length,
    }),
    [allCustomers]
  );

  const visibleRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return allCustomers.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (!normalized) return true;
      return (
        c.company.toLowerCase().includes(normalized) ||
        c.contact.toLowerCase().includes(normalized) ||
        c.email.toLowerCase().includes(normalized)
      );
    });
  }, [allCustomers, tab, search]);

  const emptyState = isLoading
    ? "Loading customers…"
    : isError
      ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-danger-text">
            {error?.message ?? "Failed to load customers"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
      : search
        ? `No customers match "${search}"`
        : "No customers in this view";

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(v) => setTab(v as TabKey)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Tabs.List>
          <Tabs.Trigger value="all">
            All <CountHint value={counts.all} loading={isLoading} />
          </Tabs.Trigger>
          <Tabs.Trigger value="active">
            Active <CountHint value={counts.active} loading={isLoading} />
          </Tabs.Trigger>
          <Tabs.Trigger value="trial">
            Trial <CountHint value={counts.trial} loading={isLoading} />
          </Tabs.Trigger>
          <Tabs.Trigger value="churned">
            Churned <CountHint value={counts.churned} loading={isLoading} />
          </Tabs.Trigger>
        </Tabs.List>
        <div className="ml-auto w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search company, contact, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading || isError}
          />
        </div>
      </div>

      <Tabs.Content value={tab} forceMount>
        <DataTable<Customer>
          columns={columns}
          rows={visibleRows}
          getRowKey={(row) => row.id}
          pagination={{
            page: 1,
            pageSize: visibleRows.length || 1,
            total: visibleRows.length,
          }}
          emptyState={emptyState}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}

function CountHint({
  value,
  loading,
}: {
  value: number;
  loading: boolean;
}) {
  return (
    <span className="text-xs text-text-tertiary">
      ({loading ? "—" : value})
    </span>
  );
}
