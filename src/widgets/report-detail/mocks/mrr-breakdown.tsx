import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export interface MrrRow {
  id: string;
  plan: "Free" | "Pro" | "Enterprise";
  region: string;
  mrr: number;
  subscribers: number;
  arpu: number; // Average Revenue Per User
  growth: number; // % MoM
}

export const mrrRows: MrrRow[] = [
  { id: "1", plan: "Pro", region: "North America", mrr: 18400, subscribers: 184, arpu: 100, growth: 12.4 },
  { id: "2", plan: "Pro", region: "Europe", mrr: 9200, subscribers: 92, arpu: 100, growth: 8.1 },
  { id: "3", plan: "Enterprise", region: "North America", mrr: 14250, subscribers: 19, arpu: 750, growth: 15.2 },
  { id: "4", plan: "Enterprise", region: "Europe", mrr: 6750, subscribers: 9, arpu: 750, growth: 6.4 },
  { id: "5", plan: "Pro", region: "United Kingdom", mrr: 4600, subscribers: 46, arpu: 100, growth: 9.8 },
  { id: "6", plan: "Enterprise", region: "United Kingdom", mrr: 3000, subscribers: 4, arpu: 750, growth: 3.2 },
  { id: "7", plan: "Pro", region: "APAC", mrr: 2300, subscribers: 23, arpu: 100, growth: 22.1 },
  { id: "8", plan: "Enterprise", region: "APAC", mrr: 1500, subscribers: 2, arpu: 750, growth: 18.4 },
  { id: "9", plan: "Pro", region: "LATAM", mrr: 1100, subscribers: 11, arpu: 100, growth: 14.0 },
  { id: "10", plan: "Free", region: "Global", mrr: 0, subscribers: 1840, arpu: 0, growth: 6.7 },
];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export const mrrColumns: Column<MrrRow>[] = [
  { key: "plan", header: "Plan", sortable: true, render: (r) => r.plan },
  { key: "region", header: "Region", sortable: true, render: (r) => r.region },
  {
    key: "mrr",
    header: "MRR",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{usd(r.mrr)}</span>,
  },
  {
    key: "subscribers",
    header: "Subscribers",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{r.subscribers.toLocaleString("en-US")}</span>,
  },
  {
    key: "arpu",
    header: "ARPU",
    align: "right",
    render: (r) => <span className="tabular-nums">{usd(r.arpu)}</span>,
  },
  {
    key: "growth",
    header: "Growth",
    sortable: true,
    align: "right",
    render: (r) => (
      <span className={`tabular-nums ${r.growth >= 0 ? "text-success-text" : "text-danger-text"}`}>
        {pct(r.growth)}
      </span>
    ),
  },
];

export const mrrCsvColumns: CsvColumn<MrrRow>[] = [
  { key: "plan", header: "Plan" },
  { key: "region", header: "Region" },
  { key: "mrr", header: "MRR (USD)" },
  { key: "subscribers", header: "Subscribers" },
  { key: "arpu", header: "ARPU (USD)" },
  { key: "growth", header: "Growth (% MoM)", format: (v) => (v as number).toFixed(1) },
];
