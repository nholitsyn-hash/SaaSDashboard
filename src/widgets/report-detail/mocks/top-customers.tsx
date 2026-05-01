import { z } from "zod";
import type { Column } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export const TopCustomerRowSchema = z.object({
  id: z.string(),
  company: z.string(),
  contact: z.string(),
  plan: z.enum(["Pro", "Enterprise"]),
  mrr: z.number(),
  since: z.string(),
});
export type TopCustomerRow = z.infer<typeof TopCustomerRowSchema>;

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const topCustomerColumns: Column<TopCustomerRow>[] = [
  {
    key: "company",
    header: "Company",
    sortable: true,
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{r.company}</span>
        <span className="text-xs text-text-tertiary">{r.contact}</span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (r) => (
      <Badge variant={r.plan === "Enterprise" ? "secondary" : "primary"}>
        {r.plan}
      </Badge>
    ),
  },
  {
    key: "mrr",
    header: "MRR",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums font-medium">{usd(r.mrr)}</span>,
  },
  {
    key: "since",
    header: "Customer since",
    sortable: true,
    align: "right",
    render: (r) => <span className="tabular-nums">{r.since}</span>,
  },
];

export const topCustomerCsvColumns: CsvColumn<TopCustomerRow>[] = [
  { key: "company", header: "Company" },
  { key: "contact", header: "Contact" },
  { key: "plan", header: "Plan" },
  { key: "mrr", header: "MRR (USD)" },
  { key: "since", header: "Customer Since" },
];
