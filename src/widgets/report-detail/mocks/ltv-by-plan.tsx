import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export interface LtvRow {
  id: string;
  plan: "Free" | "Pro" | "Enterprise";
  avgLtv: number;
  avgLifetimeMonths: number;
  subscribers: number;
  totalRevenue: number;
  churnRate: number;
}

export const ltvRows: LtvRow[] = [
  { id: "1", plan: "Free", avgLtv: 22, avgLifetimeMonths: 4.2, subscribers: 1840, totalRevenue: 40480, churnRate: 18.6 },
  { id: "2", plan: "Pro", avgLtv: 1240, avgLifetimeMonths: 14.6, subscribers: 356, totalRevenue: 441440, churnRate: 5.4 },
  { id: "3", plan: "Enterprise", avgLtv: 8750, avgLifetimeMonths: 28.3, subscribers: 34, totalRevenue: 297500, churnRate: 2.1 },
];

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
