import { Badge, Column, DataTable, Input } from "@/shared/ui";
import { mockSignups, type Signup, type SignupPlan, type SignupStatus } from "./mock";

/**
 * Recent Signups — data-table widget.
 *
 * WHY own this widget (vs. composing DataTable inline on the page):
 * Column definitions + plan/status style maps are signup-specific. Keeping
 * them in the widget means the page composes at a higher level
 * (`<RecentSignupsTable />`) and any other surface that wants to show this
 * table (admin panel, reports page later) gets the same treatment for free.
 *
 * WHY `.tsx` (not `.ts`) for mock + columns:
 * Columns are JSX — they render Badges and nested name/email layouts. The
 * column array has to live in a TSX file so the cell renderers compile.
 *
 * Visual-only this pass: no real filter, sort, or pagination handlers.
 * Pass 2 wires up state + API.
 */

const planVariant: Record<SignupPlan, "default" | "primary" | "secondary"> = {
  Free: "default",
  Pro: "primary",
  Enterprise: "secondary",
};

const statusVariant: Record<SignupStatus, "success" | "warning" | "danger"> = {
  active: "success",
  trial: "warning",
  churned: "danger",
};

const columns: Column<Signup>[] = [
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
    key: "joinedAt",
    header: "Joined",
    sortable: true,
    align: "right",
    render: (row) => <span className="tabular-nums">{row.joinedAt}</span>,
  },
];

const PAGE_SIZE = 5;
const rows = mockSignups.slice(0, PAGE_SIZE);

export function RecentSignupsTable() {
  return (
    <DataTable<Signup>
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      toolbar={
        <>
          <h3 className="text-sm font-semibold text-text-primary">
            Recent Signups
          </h3>
          <div className="w-full sm:w-64">
            <Input placeholder="Filter by name or email…" />
          </div>
        </>
      }
      pagination={{ page: 1, pageSize: PAGE_SIZE, total: mockSignups.length }}
    />
  );
}
