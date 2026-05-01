import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";

/**
 * GET /api/reports/[slug] — canned report rows per slug.
 *
 * WHY canned (not real SQL):
 *   Several reports need data we don't have shape for yet — churn-cohort
 *   needs cohort retention snapshots, subscription-changes needs an
 *   event log. Real SQL versions belong in pass 3 with a `MetricSnapshot`
 *   model. The wire envelope `{ rows: T[] }` matches what real data will
 *   produce, so widget code is identical.
 *
 * WHY one route with switch (not 6 separate routes):
 *   The wire shape is uniform; only the row payload differs. One file is
 *   easier to scan + audit. Each branch is a few lines of typed data.
 */

const REPORT_DATA = {
  "mrr-breakdown": [
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
  ],
  "churn-cohort": [
    { id: "1", cohort: "Nov '25", size: 240, month1: 85, month2: 72, month3: 64, churnRate: 7.2, topReason: "Too expensive" },
    { id: "2", cohort: "Dec '25", size: 268, month1: 86, month2: 74, month3: 66, churnRate: 6.8, topReason: "Missing feature" },
    { id: "3", cohort: "Jan '26", size: 295, month1: 87, month2: 75, month3: 68, churnRate: 6.5, topReason: "Missing feature" },
    { id: "4", cohort: "Feb '26", size: 312, month1: 88, month2: 77, month3: null, churnRate: 6.1, topReason: "Poor support" },
    { id: "5", cohort: "Mar '26", size: 340, month1: 89, month2: null, month3: null, churnRate: 5.8, topReason: "Consolidation" },
    { id: "6", cohort: "Apr '26", size: 358, month1: null, month2: null, month3: null, churnRate: 0, topReason: "—" },
  ],
  "ltv-by-plan": [
    { id: "1", plan: "Free", avgLtv: 22, avgLifetimeMonths: 4.2, subscribers: 1840, totalRevenue: 40480, churnRate: 18.6 },
    { id: "2", plan: "Pro", avgLtv: 1240, avgLifetimeMonths: 14.6, subscribers: 356, totalRevenue: 441440, churnRate: 5.4 },
    { id: "3", plan: "Enterprise", avgLtv: 8750, avgLifetimeMonths: 28.3, subscribers: 34, totalRevenue: 297500, churnRate: 2.1 },
  ],
  "revenue-by-region": [
    { id: "1", region: "North America", mrr: 32650, subscribers: 203, growthYoy: 28.4, share: 48.3 },
    { id: "2", region: "Europe", mrr: 15950, subscribers: 101, growthYoy: 18.7, share: 23.6 },
    { id: "3", region: "United Kingdom", mrr: 7600, subscribers: 50, growthYoy: 14.2, share: 11.2 },
    { id: "4", region: "APAC", mrr: 3800, subscribers: 25, growthYoy: 41.6, share: 5.6 },
    { id: "5", region: "LATAM", mrr: 1100, subscribers: 11, growthYoy: 22.0, share: 1.6 },
    { id: "6", region: "Global (Free)", mrr: 0, subscribers: 1840, growthYoy: 6.7, share: 9.7 },
  ],
  "top-customers": [
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
  ],
  "subscription-changes": [
    { id: "1", date: "2026-04-18", customer: "Emma Carter", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
    { id: "2", date: "2026-04-18", customer: "Noah Bennett", action: "new", fromPlan: "—", toPlan: "Pro", mrrImpact: 100 },
    { id: "3", date: "2026-04-17", customer: "Olivia Hughes", action: "cancel", fromPlan: "Enterprise", toPlan: "—", mrrImpact: -750 },
    { id: "4", date: "2026-04-17", customer: "Liam Walsh", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
    { id: "5", date: "2026-04-16", customer: "Sophia Reed", action: "downgrade", fromPlan: "Pro", toPlan: "Free", mrrImpact: -100 },
    { id: "6", date: "2026-04-16", customer: "Mason Clark", action: "new", fromPlan: "—", toPlan: "Pro", mrrImpact: 100 },
    { id: "7", date: "2026-04-15", customer: "Ava Sullivan", action: "upgrade", fromPlan: "Free", toPlan: "Pro", mrrImpact: 100 },
    { id: "8", date: "2026-04-15", customer: "James Parker", action: "cancel", fromPlan: "Free", toPlan: "—", mrrImpact: 0 },
    { id: "9", date: "2026-04-14", customer: "Charlotte Hayes", action: "upgrade", fromPlan: "Pro", toPlan: "Enterprise", mrrImpact: 650 },
    { id: "10", date: "2026-04-14", customer: "Henry Morgan", action: "new", fromPlan: "—", toPlan: "Free", mrrImpact: 0 },
  ],
} as const;

type Slug = keyof typeof REPORT_DATA;

const KNOWN_SLUGS = new Set<string>(Object.keys(REPORT_DATA));

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  if (!KNOWN_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Unknown report" }, { status: 404 });
  }

  return NextResponse.json({ rows: REPORT_DATA[slug as Slug] });
}
