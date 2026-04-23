import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export interface ChurnCohortRow {
  id: string;
  cohort: string;
  size: number;
  month1: number;
  month2: number;
  month3: number;
  churnRate: number;
  topReason: string;
}

export const churnCohortRows: ChurnCohortRow[] = [
  { id: "1", cohort: "Nov '25", size: 240, month1: 85, month2: 72, month3: 64, churnRate: 7.2, topReason: "Too expensive" },
  { id: "2", cohort: "Dec '25", size: 268, month1: 86, month2: 74, month3: 66, churnRate: 6.8, topReason: "Missing feature" },
  { id: "3", cohort: "Jan '26", size: 295, month1: 87, month2: 75, month3: 68, churnRate: 6.5, topReason: "Missing feature" },
  { id: "4", cohort: "Feb '26", size: 312, month1: 88, month2: 77, month3: null as unknown as number, churnRate: 6.1, topReason: "Poor support" },
  { id: "5", cohort: "Mar '26", size: 340, month1: 89, month2: null as unknown as number, month3: null as unknown as number, churnRate: 5.8, topReason: "Consolidation" },
  { id: "6", cohort: "Apr '26", size: 358, month1: null as unknown as number, month2: null as unknown as number, month3: null as unknown as number, churnRate: 0, topReason: "—" },
];

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
