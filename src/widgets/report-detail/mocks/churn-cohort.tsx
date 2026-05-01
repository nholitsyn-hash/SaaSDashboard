import { z } from "zod";
import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const ChurnCohortRowSchema = z.object({
  id: z.string(),
  cohort: z.string(),
  size: z.number(),
  month1: z.number().nullable(),
  month2: z.number().nullable(),
  month3: z.number().nullable(),
  churnRate: z.number(),
  topReason: z.string(),
});
export type ChurnCohortRow = z.infer<typeof ChurnCohortRowSchema>;

const pct = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? "—" : `${n}%`;

export const churnCohortColumns: Column<ChurnCohortRow>[] = [
  { key: "cohort", header: "Cohort", sortable: true, render: (r) => r.cohort },
  {
    key: "size",
    header: "Size",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{r.size.toLocaleString("en-US")}</span>,
  },
  {
    key: "month1",
    header: "M1 Retention",
    align: "right",
    render: (r) => <span className="tabular-nums">{pct(r.month1)}</span>,
  },
  {
    key: "month2",
    header: "M2 Retention",
    align: "right",
    render: (r) => <span className="tabular-nums">{pct(r.month2)}</span>,
  },
  {
    key: "month3",
    header: "M3 Retention",
    align: "right",
    render: (r) => <span className="tabular-nums">{pct(r.month3)}</span>,
  },
  {
    key: "churnRate",
    header: "Churn",
    sortable: true,
    align: "right",
    render: (r) => (
      <span className="tabular-nums text-danger-text">
        {r.churnRate ? `${r.churnRate}%` : "—"}
      </span>
    ),
  },
  { key: "topReason", header: "Top reason", render: (r) => r.topReason },
];

export const churnCohortCsvColumns: CsvColumn<ChurnCohortRow>[] = [
  { key: "cohort", header: "Cohort" },
  { key: "size", header: "Size" },
  { key: "month1", header: "M1 Retention (%)" },
  { key: "month2", header: "M2 Retention (%)" },
  { key: "month3", header: "M3 Retention (%)" },
  { key: "churnRate", header: "Churn Rate (%)" },
  { key: "topReason", header: "Top Reason" },
];
