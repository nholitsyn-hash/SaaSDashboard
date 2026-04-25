"use client";

import { Badge, Button, Column, DataTable, Input } from "@/shared/ui";
import { useDashboard, type RecentSignup } from "@/entities/dashboard";

const planVariant: Record<string, "default" | "primary" | "secondary"> = {
  Free: "default",
  Pro: "primary",
  Enterprise: "secondary",
};

const statusVariant: Record<
  RecentSignup["status"],
  "success" | "warning" | "danger"
> = {
  active: "success",
  trial: "warning",
  churned: "danger",
};

const columns: Column<RecentSignup>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{row.name}</span>
        <span className="text-xs text-text-tertiary">{row.email}</span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (row) => (
      <Badge variant={planVariant[row.plan] ?? "default"}>{row.plan}</Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
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

export function RecentSignupsTable() {
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const rows = data?.recentSignups ?? [];

  const emptyState = isLoading
    ? "Loading recent signups…"
    : isError
      ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-danger-text">
            {error?.message ?? "Failed to load"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
      : "No recent signups";

  return (
    <DataTable<RecentSignup>
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      toolbar={
        <>
          <h3 className="text-sm font-semibold text-text-primary">
            Recent Signups
          </h3>
          <div className="w-full sm:w-64">
            <Input placeholder="Filter by name or email…" disabled={isLoading} />
          </div>
        </>
      }
      pagination={{
        page: 1,
        pageSize: rows.length || 1,
        total: rows.length,
      }}
      emptyState={emptyState}
    />
  );
}
