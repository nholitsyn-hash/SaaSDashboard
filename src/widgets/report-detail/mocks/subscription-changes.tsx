import type { Column } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export type SubChangeAction = "upgrade" | "downgrade" | "cancel" | "new";

export interface SubChangeRow {
  id: string;
  date: string;
  customer: string;
  action: SubChangeAction;
  fromPlan: string;
  toPlan: string;
  mrrImpact: number; // positive or negative
}

export const subChangeRows: SubChangeRow[] = [
  { id: "1", date: "2026-04-18", customer: "Emma Carter", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
  { id: "2", date: "2026-04-18", customer: "Noah Bennett", action: "new", fromPlan: "—", toPlan: "Pro", mrrImpact: 100 },
  { id: "3", date: "2026-04-17", customer: "Olivia Hughes", action: "cancel", fromPlan: "Enterprise", toPlan: "—", mrrImpact: -750 },
  { id: "4", date: "2026-04-17", customer: "Liam Walsh", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
  { id: "5", date: "2026-04-16", customer: "Sophia Reed", action: "downgrade", fromPlan: "Pro", toPlan: "Free", mrrImpact: -100 },
  { id: "6", date: "2026-04-16", customer: "Mason Clark", action: "new", fromPlan: "—", toPlan: "Pro", mrrImpact: 100 },
  { id: "7", date: "2026-04-15", customer: "Ava Sullivan", action: "upgrade", fromPlan: "Free", toPlan: "Pro", mrrImpact: 100 },
  { id: "8", date: "2026-04-15", customer: "James Parker", action: "cancel", fromPlan: "Free", toPlan: "—", mrrImpact: 0 },
  { id: "9", date: "2026-04-14", customer: "Charlotte Hayes", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
  { id: "10", date: "2026-04-14", customer: "Henry Morgan", action: "new", fromPlan: "—", toPlan: "Free", mrrImpact: 0 },
];

const actionVariant: Record<SubChangeAction, "success" | "primary" | "warning" | "danger"> = {
  new: "success",
  upgrade: "primary",
  downgrade: "warning",
  cancel: "danger",
};

const usd = (n: number) =>
  `${n < 0 ? "-" : n > 0 ? "+" : ""}$${Math.abs(n).toLocaleString("en-US")}`;

export const subChangeColumns: Column<SubChangeRow>[] = [
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (r) => <span className="tabular-nums text-text-secondary">{r.date}</span>,
  },
  { key: "customer", header: "Customer", sortable: true, render: (r) => r.customer },
  {
    key: "action",
    header: "Action",
    render: (r) => (
      <Badge variant={actionVariant[r.action]} className="capitalize">
        {r.action}
      </Badge>
    ),
  },
  { key: "fromPlan", header: "From", render: (r) => r.fromPlan },
  { key: "toPlan", header: "To", render: (r) => r.toPlan },
  {
    key: "mrrImpact",
    header: "MRR Impact",
    sortable: true,
    align: "right",
    render: (r) => (
      <span
        className={`tabular-nums font-medium ${
          r.mrrImpact > 0
            ? "text-success-text"
            : r.mrrImpact < 0
              ? "text-danger-text"
              : "text-text-tertiary"
        }`}
      >
        {usd(r.mrrImpact)}
      </span>
    ),
  },
];

export const subChangeCsvColumns: CsvColumn<SubChangeRow>[] = [
  { key: "date", header: "Date" },
  { key: "customer", header: "Customer" },
  { key: "action", header: "Action" },
  { key: "fromPlan", header: "From Plan" },
  { key: "toPlan", header: "To Plan" },
  { key: "mrrImpact", header: "MRR Impact (USD)" },
];
