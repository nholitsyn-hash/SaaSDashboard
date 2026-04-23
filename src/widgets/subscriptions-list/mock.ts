/**
 * Mock subscription data — 20 rows, mix of Pro/Enterprise with varying states.
 * Companies reference the Customers mock where possible for consistency;
 * in Pass 2 both datasets will merge into a single Prisma query.
 */

export type SubStatus = "active" | "trial" | "paused" | "canceled";
export type SubPlan = "Pro" | "Enterprise";
export type BillingCycle = "monthly" | "annual";

export interface Subscription {
  id: string;
  customer: string;
  plan: SubPlan;
  cycle: BillingCycle;
  status: SubStatus;
  mrr: number;
  startedAt: string;
  renewsAt: string;
}

export const mockSubscriptions: Subscription[] = [
  { id: "s-1001", customer: "Northwind Labs", plan: "Enterprise", cycle: "annual", status: "active", mrr: 4200, startedAt: "2023-11-14", renewsAt: "2026-11-14" },
  { id: "s-1002", customer: "Meridian Systems", plan: "Enterprise", cycle: "annual", status: "active", mrr: 3600, startedAt: "2024-02-03", renewsAt: "2027-02-03" },
  { id: "s-1003", customer: "Glacier Works", plan: "Enterprise", cycle: "monthly", status: "active", mrr: 3250, startedAt: "2024-05-22", renewsAt: "2026-05-22" },
  { id: "s-1004", customer: "Harbor Studios", plan: "Enterprise", cycle: "annual", status: "active", mrr: 2800, startedAt: "2024-07-09", renewsAt: "2026-07-09" },
  { id: "s-1005", customer: "Cedar Ventures", plan: "Enterprise", cycle: "annual", status: "active", mrr: 4500, startedAt: "2024-09-30", renewsAt: "2026-09-30" },
  { id: "s-1006", customer: "Aperture Media", plan: "Pro", cycle: "monthly", status: "active", mrr: 1450, startedAt: "2025-01-18", renewsAt: "2026-05-18" },
  { id: "s-1007", customer: "Pinnacle Partners", plan: "Pro", cycle: "monthly", status: "active", mrr: 1220, startedAt: "2025-03-04", renewsAt: "2026-05-04" },
  { id: "s-1008", customer: "Summit & Co", plan: "Pro", cycle: "annual", status: "active", mrr: 1150, startedAt: "2025-04-12", renewsAt: "2026-04-12" },
  { id: "s-1009", customer: "Acme Corp", plan: "Pro", cycle: "monthly", status: "active", mrr: 980, startedAt: "2025-08-02", renewsAt: "2026-05-02" },
  { id: "s-1010", customer: "Beacon Industries", plan: "Pro", cycle: "monthly", status: "active", mrr: 860, startedAt: "2025-11-27", renewsAt: "2026-04-27" },
  { id: "s-1011", customer: "Lighthouse Ltd", plan: "Pro", cycle: "monthly", status: "active", mrr: 740, startedAt: "2026-01-15", renewsAt: "2026-05-15" },
  { id: "s-1012", customer: "Spruce Analytics", plan: "Pro", cycle: "monthly", status: "active", mrr: 700, startedAt: "2026-01-22", renewsAt: "2026-05-22" },
  { id: "s-1013", customer: "Kite Software", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-02", renewsAt: "2026-04-16" },
  { id: "s-1014", customer: "Tangent Labs", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-06", renewsAt: "2026-04-20" },
  { id: "s-1015", customer: "Foxglove Inc", plan: "Enterprise", cycle: "annual", status: "trial", mrr: 0, startedAt: "2026-04-10", renewsAt: "2026-04-24" },
  { id: "s-1016", customer: "Blueprint Studio", plan: "Pro", cycle: "monthly", status: "trial", mrr: 0, startedAt: "2026-04-15", renewsAt: "2026-04-29" },
  { id: "s-1017", customer: "Willow Digital", plan: "Pro", cycle: "monthly", status: "paused", mrr: 0, startedAt: "2025-09-12", renewsAt: "—" },
  { id: "s-1018", customer: "Arcade Robotics", plan: "Enterprise", cycle: "annual", status: "canceled", mrr: 0, startedAt: "2025-02-18", renewsAt: "—" },
  { id: "s-1019", customer: "Quartz Digital", plan: "Pro", cycle: "monthly", status: "canceled", mrr: 0, startedAt: "2025-06-11", renewsAt: "—" },
  { id: "s-1020", customer: "Obsidian Media", plan: "Pro", cycle: "monthly", status: "canceled", mrr: 0, startedAt: "2025-07-22", renewsAt: "—" },
];

export const subscriptionKpis = {
  active: mockSubscriptions.filter((s) => s.status === "active").length,
  mrr: mockSubscriptions.reduce((sum, s) => sum + s.mrr, 0),
  arpu: Math.round(
    mockSubscriptions.reduce((sum, s) => sum + s.mrr, 0) /
      Math.max(mockSubscriptions.filter((s) => s.status === "active").length, 1)
  ),
  netNew: 4,
};
