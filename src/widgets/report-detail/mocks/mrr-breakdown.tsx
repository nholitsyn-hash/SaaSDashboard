import { z } from "zod";
import type { Column } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const MrrRowSchema = z.object({
  id: z.string(),
  plan: z.enum(["Free", "Pro", "Enterprise"]),
  region: z.string(),
  mrr: z.number(),
  subscribers: z.number(),
  arpu: z.number(),
  growth: z.number(),
});
export type MrrRow = z.infer<typeof MrrRowSchema>;

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
