import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export interface RegionRow {
  id: string;
  region: string;
  mrr: number;
  subscribers: number;
  growthYoy: number;
  share: number;
}

export const regionRows: RegionRow[] = [
  { id: "1", region: "North America", mrr: 32650, subscribers: 203, growthYoy: 28.4, share: 48.3 },
  { id: "2", region: "Europe", mrr: 15950, subscribers: 101, growthYoy: 18.7, share: 23.6 },
  { id: "3", region: "United Kingdom", mrr: 7600, subscribers: 50, growthYoy: 14.2, share: 11.2 },
  { id: "4", region: "APAC", mrr: 3800, subscribers: 25, growthYoy: 41.6, share: 5.6 },
  { id: "5", region: "LATAM", mrr: 1100, subscribers: 11, growthYoy: 22.0, share: 1.6 },
  { id: "6", region: "Global (Free)", mrr: 0, subscribers: 1840, growthYoy: 6.7, share: 9.7 },
];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export const regionColumns: Column<RegionRow>[] = [
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
    key: "growthYoy",
    header: "YoY Growth",
    sortable: true,
    align: "right",
    render: (r) => (
      <span className="tabular-nums text-success-text">{pct(r.growthYoy)}</span>
    ),
  },
  {
    key: "share",
    header: "Share",
    align: "right",
    render: (r) => <span className="tabular-nums">{r.share.toFixed(1)}%</span>,
  },
];

export const regionCsvColumns: CsvColumn<RegionRow>[] = [
  { key: "region", header: "Region" },
  { key: "mrr", header: "MRR (USD)" },
  { key: "subscribers", header: "Subscribers" },
  { key: "growthYoy", header: "YoY Growth (%)", format: (v) => (v as number).toFixed(1) },
  { key: "share", header: "Share (%)", format: (v) => (v as number).toFixed(1) },
];
