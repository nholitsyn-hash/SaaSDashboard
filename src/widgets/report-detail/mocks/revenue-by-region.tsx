import { z } from "zod";
import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const RegionRowSchema = z.object({
  id: z.string(),
  region: z.string(),
  mrr: z.number(),
  subscribers: z.number(),
  growthYoy: z.number(),
  share: z.number(),
});
export type RegionRow = z.infer<typeof RegionRowSchema>;

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
