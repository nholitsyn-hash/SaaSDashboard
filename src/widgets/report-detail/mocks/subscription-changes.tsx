import { z } from "zod";
import type { Column } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const SubChangeActionSchema = z.enum([
  "upgrade",
  "downgrade",
  "cancel",
  "new",
]);
export type SubChangeAction = z.infer<typeof SubChangeActionSchema>;

export const SubChangeRowSchema = z.object({
  id: z.string(),
  date: z.string(),
  customer: z.string(),
  action: SubChangeActionSchema,
  fromPlan: z.string(),
  toPlan: z.string(),
  mrrImpact: z.number(),
});
export type SubChangeRow = z.infer<typeof SubChangeRowSchema>;

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
