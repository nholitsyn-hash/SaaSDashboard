/**
 * Mock customer list — 20 accounts across active/trial/churned states.
 * Pass 2 will replace with Prisma query + real API.
 */

export type CustomerStatus = "active" | "trial" | "churned";
export type CustomerPlan = "Free" | "Pro" | "Enterprise";

export interface Customer {
  id: string;
  company: string;
  contact: string;
  email: string;
  plan: CustomerPlan;
  status: CustomerStatus;
  mrr: number;
  region: string;
  joinedAt: string;
}

export const mockCustomers: Customer[] = [
  { id: "1", company: "Northwind Labs", contact: "Liam Walsh", email: "liam@northwind.io", plan: "Enterprise", status: "active", mrr: 4200, region: "North America", joinedAt: "2023-11-14" },
  { id: "2", company: "Meridian Systems", contact: "Isabella Mitchell", email: "isabella@meridian.io", plan: "Enterprise", status: "active", mrr: 3600, region: "North America", joinedAt: "2024-02-03" },
  { id: "3", company: "Glacier Works", contact: "Benjamin Foster", email: "ben@glacier.io", plan: "Enterprise", status: "active", mrr: 3250, region: "Europe", joinedAt: "2024-05-22" },
  { id: "4", company: "Harbor Studios", contact: "Ethan Brooks", email: "ethan@harbor.dev", plan: "Enterprise", status: "active", mrr: 2800, region: "North America", joinedAt: "2024-07-09" },
  { id: "5", company: "Aperture Media", contact: "Mason Clark", email: "mason@aperture.co", plan: "Pro", status: "active", mrr: 1450, region: "United Kingdom", joinedAt: "2025-01-18" },
  { id: "6", company: "Pinnacle Partners", contact: "Mia Thompson", email: "mia@pinnacle.io", plan: "Pro", status: "active", mrr: 1220, region: "Europe", joinedAt: "2025-03-04" },
  { id: "7", company: "Summit & Co", contact: "Amelia Rivera", email: "amelia@summit.co", plan: "Pro", status: "active", mrr: 1150, region: "North America", joinedAt: "2025-04-12" },
  { id: "8", company: "Acme Corp", contact: "Emma Carter", email: "emma@acme.co", plan: "Pro", status: "active", mrr: 980, region: "Europe", joinedAt: "2025-08-02" },
  { id: "9", company: "Beacon Industries", contact: "Henry Morgan", email: "henry@beacon.io", plan: "Pro", status: "active", mrr: 860, region: "APAC", joinedAt: "2025-11-27" },
  { id: "10", company: "Lighthouse Ltd", contact: "Olivia Hughes", email: "olivia@lighthouse.co", plan: "Pro", status: "active", mrr: 740, region: "North America", joinedAt: "2026-01-15" },
  { id: "11", company: "Spruce Analytics", contact: "Charlotte Hayes", email: "charlotte@spruce.dev", plan: "Pro", status: "active", mrr: 700, region: "North America", joinedAt: "2026-01-22" },
  { id: "12", company: "Cedar Ventures", contact: "Lucas Bennett", email: "lucas@cedar.vc", plan: "Enterprise", status: "active", mrr: 4500, region: "Europe", joinedAt: "2024-09-30" },
  { id: "13", company: "Kite Software", contact: "Grace Parker", email: "grace@kite.dev", plan: "Pro", status: "trial", mrr: 0, region: "North America", joinedAt: "2026-04-02" },
  { id: "14", company: "Tangent Labs", contact: "Oliver Reed", email: "oliver@tangent.io", plan: "Pro", status: "trial", mrr: 0, region: "United Kingdom", joinedAt: "2026-04-06" },
  { id: "15", company: "Foxglove Inc", contact: "Ella Foster", email: "ella@foxglove.co", plan: "Enterprise", status: "trial", mrr: 0, region: "LATAM", joinedAt: "2026-04-10" },
  { id: "16", company: "Blueprint Studio", contact: "Nathan Wells", email: "nathan@blueprint.co", plan: "Pro", status: "trial", mrr: 0, region: "APAC", joinedAt: "2026-04-15" },
  { id: "17", company: "Quartz Digital", contact: "Lily Brooks", email: "lily@quartz.io", plan: "Pro", status: "churned", mrr: 0, region: "Europe", joinedAt: "2025-06-11" },
  { id: "18", company: "Arcade Robotics", contact: "Caleb Turner", email: "caleb@arcade.co", plan: "Enterprise", status: "churned", mrr: 0, region: "North America", joinedAt: "2025-02-18" },
  { id: "19", company: "Obsidian Media", contact: "Zoe Martin", email: "zoe@obsidian.co", plan: "Pro", status: "churned", mrr: 0, region: "North America", joinedAt: "2025-07-22" },
  { id: "20", company: "Brightside App", contact: "Isaac Hill", email: "isaac@brightside.app", plan: "Free", status: "active", mrr: 0, region: "APAC", joinedAt: "2026-02-14" },
];

export const customerStatusCounts = {
  all: mockCustomers.length,
  active: mockCustomers.filter((c) => c.status === "active").length,
  trial: mockCustomers.filter((c) => c.status === "trial").length,
  churned: mockCustomers.filter((c) => c.status === "churned").length,
};
