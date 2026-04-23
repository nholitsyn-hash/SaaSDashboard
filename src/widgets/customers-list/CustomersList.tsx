"use client";

import { useMemo, useState } from "react";
import { Badge, DataTable, Input, Tabs, type Column } from "@/shared/ui";
import {
  mockCustomers,
  customerStatusCounts,
  type Customer,
  type CustomerPlan,
  type CustomerStatus,
} from "./mock";

/**
 * CustomersList — tabbed, searchable customer directory.
 *
 * WHY search stays as local state (not URL param):
 * Pass 1 is visual — search debouncing + URL sync lands in pass 2 when
 * real data arrives. Local state keeps the widget self-contained and
 * gets replaced cleanly with a store/param when the time comes.
 *
 * WHY the tabs-filter uses `useMemo`:
 * rows.filter runs on every keystroke; memoizing against (tab, search)
 * prevents recompute when an unrelated re-render happens.
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
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const visibleRows = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return mockCustomers.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (!normalized) return true;
      return (
        c.company.toLowerCase().includes(normalized) ||
        c.contact.toLowerCase().includes(normalized) ||
        c.email.toLowerCase().includes(normalized)
      );
    });
  }, [tab, search]);

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(v) => setTab(v as TabKey)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Tabs.List>
          <Tabs.Trigger value="all">
            All <span className="text-xs text-text-tertiary">({customerStatusCounts.all})</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="active">
            Active <span className="text-xs text-text-tertiary">({customerStatusCounts.active})</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="trial">
            Trial <span className="text-xs text-text-tertiary">({customerStatusCounts.trial})</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="churned">
            Churned <span className="text-xs text-text-tertiary">({customerStatusCounts.churned})</span>
          </Tabs.Trigger>
        </Tabs.List>
        <div className="ml-auto w-full sm:w-72">
          <Input
            type="search"
            placeholder="Search company, contact, or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          emptyState={
            search
              ? `No customers match "${search}"`
              : "No customers in this view"
          }
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}
