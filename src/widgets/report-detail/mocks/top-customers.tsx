import type { Column } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import type { CsvColumn } from "@/shared/utils/csv";

export interface TopCustomerRow {
  id: string;
  company: string;
  contact: string;
  plan: "Pro" | "Enterprise";
  mrr: number;
  since: string;
}

export const topCustomerRows: TopCustomerRow[] = [
  { id: "1", company: "Northwind Labs", contact: "Liam Walsh", plan: "Enterprise", mrr: 4200, since: "2023-11-14" },
  { id: "2", company: "Meridian Systems", contact: "Isabella Mitchell", plan: "Enterprise", mrr: 3600, since: "2024-02-03" },
  { id: "3", company: "Glacier Works", contact: "Benjamin Foster", plan: "Enterprise", mrr: 3250, since: "2024-05-22" },
  { id: "4", company: "Harbor Studios", contact: "Ethan Brooks", plan: "Enterprise", mrr: 2800, since: "2024-07-09" },
  { id: "5", company: "Aperture Media", contact: "Mason Clark", plan: "Pro", mrr: 1450, since: "2025-01-18" },
  { id: "6", company: "Pinnacle Partners", contact: "Mia Thompson", plan: "Pro", mrr: 1220, since: "2025-03-04" },
  { id: "7", company: "Summit & Co", contact: "Amelia Rivera", plan: "Pro", mrr: 1150, since: "2025-04-12" },
  { id: "8", company: "Acme Corp", contact: "Emma Carter", plan: "Pro", mrr: 980, since: "2025-08-02" },
  { id: "9", company: "Beacon Industries", contact: "Henry Morgan", plan: "Pro", mrr: 860, since: "2025-11-27" },
  { id: "10", company: "Lighthouse Ltd", contact: "Olivia Hughes", plan: "Pro", mrr: 740, since: "2026-01-15" },
];

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
