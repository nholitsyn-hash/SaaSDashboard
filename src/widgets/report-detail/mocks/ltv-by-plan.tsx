import { z } from "zod";
import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const LtvRowSchema = z.object({
  id: z.string(),
  plan: z.enum(["Free", "Pro", "Enterprise"]),
  avgLtv: z.number(),
  avgLifetimeMonths: z.number(),
  subscribers: z.number(),
  totalRevenue: z.number(),
  churnRate: z.number(),
});
export type LtvRow = z.infer<typeof LtvRowSchema>;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const ltvColumns: Column<LtvRow>[] = [
  { key: "plan", header: "Plan", sortable: true, render: (r) => r.plan },
  {
    key: "avgLtv",
    header: "Avg LTV",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{usd(r.avgLtv)}</span>,
  },
  {
    key: "avgLifetimeMonths",
    header: "Avg Lifetime",
    align: "right",
    render: (r) => <span className="tabular-nums">{r.avgLifetimeMonths.toFixed(1)} mo</span>,
  },
  {
    key: "subscribers",
    header: "Subscribers",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{r.subscribers.toLocaleString("en-US")}</span>,
  },
  {
    key: "totalRevenue",
    header: "Total Revenue",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{usd(r.totalRevenue)}</span>,
  },
  {
    key: "churnRate",
    header: "Churn",
    align: "right",
    render: (r) => <span className="tabular-nums text-danger-text">{r.churnRate}%</span>,
  },
];

export const ltvCsvColumns: CsvColumn<LtvRow>[] = [
  { key: "plan", header: "Plan" },
  { key: "avgLtv", header: "Avg LTV (USD)" },
  { key: "avgLifetimeMonths", header: "Avg Lifetime (months)" },
  { key: "subscribers", header: "Subscribers" },
  { key: "totalRevenue", header: "Total Revenue (USD)" },
  { key: "churnRate", header: "Churn Rate (%)" },
];
