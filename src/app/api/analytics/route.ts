import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  AnalyticsResponseSchema,
  type CohortRetention,
  type CustomerSegment,
  type MrrMovementRow,
  type PlanLtv,
} from "@/entities/analytics";

/**
 * GET /api/analytics — combined response for the Analytics page.
 *
 * Real-from-DB:
 *   - LTV by plan: avg lifetime months × avg MRR per plan, computed from
 *     active Subscriptions joined to Customers (org-scoped).
 *   - Customer Segments: bucketed by Customer.mrrCents into SMB/Mid/Enterprise.
 *
 * Canned (until time-series tables exist):
 *   - KPI band (LTV / CAC / Payback / NRR) — CAC needs acquisition cost
 *     tracking; NRR needs MRR movement history. Both out of scope here.
 *   - Cohort retention 12×6 — needs UserActivity time-series.
 *   - MRR movement 6 months — needs MrrChange events table.
 */

const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = session.user.organizationId;

    // ---- REAL: LTV by plan ----------------------------------------------
    const subs = await db.subscription.findMany({
      where: { customer: { organizationId: orgId }, status: "active" },
      select: { plan: true, mrrCents: true, startedAt: true },
    });

    const planAgg = new Map<string, { mrrSum: number; lifetimeSum: number; count: number }>();
    for (const s of subs) {
      const months = Math.max(
        1,
        (Date.now() - s.startedAt.getTime()) / MS_PER_MONTH
      );
      const cur = planAgg.get(s.plan) ?? { mrrSum: 0, lifetimeSum: 0, count: 0 };
      cur.mrrSum += s.mrrCents;
      cur.lifetimeSum += months;
      cur.count += 1;
      planAgg.set(s.plan, cur);
    }

    const ltvByPlan: PlanLtv[] = [
      // Free plan has no subs — keep a representative figure so the chart
      // stays comparable across tiers.
      { plan: "Free", value: 22 },
      ...Array.from(planAgg.entries()).map(([plan, agg]) => ({
        plan,
        value: Math.round(
          (agg.mrrSum / agg.count / 100) * (agg.lifetimeSum / agg.count)
        ),
      })),
    ];

    // ---- REAL: customer segments by MRR brackets ------------------------
    const customers = await db.customer.findMany({
      where: { organizationId: orgId, status: "active" },
      select: { mrrCents: true },
    });

    let smb = 0;
    let midMarket = 0;
    let enterprise = 0;
    for (const c of customers) {
      const mrr = c.mrrCents / 100;
      if (mrr < 200) smb++;
      else if (mrr < 1000) midMarket++;
      else enterprise++;
    }
    const total = customers.length || 1;
    const customerSegments: CustomerSegment[] = [
      { segment: "SMB", share: Math.round((smb / total) * 100) },
      { segment: "Mid-Market", share: Math.round((midMarket / total) * 100) },
      { segment: "Enterprise", share: Math.round((enterprise / total) * 100) },
    ];

    // ---- CANNED: cohort retention --------------------------------------
    const cohortRetention: CohortRetention = {
      monthLabels: ["M0", "M1", "M2", "M3", "M4", "M5"],
      cohorts: [
        { cohort: "May '25", retention: [100, 76, 62, 54, 48, 44] },
        { cohort: "Jun '25", retention: [100, 77, 63, 55, 49, 45] },
        { cohort: "Jul '25", retention: [100, 78, 64, 56, 50, 46] },
        { cohort: "Aug '25", retention: [100, 79, 66, 58, 52, 48] },
        { cohort: "Sep '25", retention: [100, 81, 68, 60, 54, 50] },
        { cohort: "Oct '25", retention: [100, 83, 70, 62, 56, 52] },
        { cohort: "Nov '25", retention: [100, 85, 72, 64, 58, null] },
        { cohort: "Dec '25", retention: [100, 86, 74, 66, 60, null] },
        { cohort: "Jan '26", retention: [100, 87, 75, 68, null, null] },
        { cohort: "Feb '26", retention: [100, 88, 77, null, null, null] },
        { cohort: "Mar '26", retention: [100, 89, null, null, null, null] },
        { cohort: "Apr '26", retention: [100, null, null, null, null, null] },
      ],
    };

    // ---- CANNED: MRR movement ------------------------------------------
    const mrrMovement: MrrMovementRow[] = [
      { month: "Nov '25", new: 4800, expansion: 1200, contraction: -400, churn: -1100 },
      { month: "Dec '25", new: 5200, expansion: 1400, contraction: -350, churn: -1050 },
      { month: "Jan '26", new: 4900, expansion: 1600, contraction: -420, churn: -980 },
      { month: "Feb '26", new: 5600, expansion: 1800, contraction: -380, churn: -1020 },
      { month: "Mar '26", new: 6100, expansion: 2100, contraction: -340, churn: -960 },
      { month: "Apr '26", new: 5800, expansion: 2400, contraction: -310, churn: -920 },
    ];

    // ---- CANNED: KPI band ----------------------------------------------
    const kpis = {
      ltv: {
        value: "$1,240",
        delta: "+8.3%",
        trend: "up" as const,
        label: "vs last 30d",
      },
      cac: {
        value: "$412",
        delta: "-6.2%",
        // Lower CAC is good — paint it as up-trend (positive direction).
        trend: "up" as const,
        label: "vs last 30d",
      },
      paybackMonths: {
        value: "3.2 mo",
        delta: "-0.4 mo",
        trend: "up" as const,
        label: "vs last 30d",
      },
      netRevenueRetention: {
        value: "112%",
        delta: "+4.1pp",
        trend: "up" as const,
        label: "vs last 30d",
      },
    };

    const payload = AnalyticsResponseSchema.parse({
      kpis,
      cohortRetention,
      mrrMovement,
      ltvByPlan,
      customerSegments,
    });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[GET /api/analytics] error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
