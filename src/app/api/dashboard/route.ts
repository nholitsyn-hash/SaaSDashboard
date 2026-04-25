import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  DashboardOverviewResponseSchema,
  type DashboardOverviewResponse,
} from "@/entities/dashboard";

/**
 * GET /api/dashboard — full dashboard page payload.
 *
 * Real-from-DB:
 *   - MRR (sum of active subscription.mrrCents)
 *   - activeUsers (count of customers with status='active')
 *   - revenueByPlan (groupby subscription.plan)
 *   - revenueByRegion (join Subscription→Customer, groupby region)
 *   - recentSignups (latest 5 customers by joinedAt)
 *   - conversion = approved signup requests / total signup requests
 *
 * Canned (mock arrays inlined here):
 *   - mrrTrend / activeUsersTrend / churnTrend / conversionFunnel —
 *     these need a DailyMetric snapshot table, which is its own
 *     production concern. Inline here so the wire format stays uniform —
 *     widgets read from the same response shape regardless of source.
 */

const cannedMrrTrend = [
  { date: "2026-03-20", value: 42800 },
  { date: "2026-03-21", value: 43120 },
  { date: "2026-03-22", value: 42950 },
  { date: "2026-03-23", value: 43400 },
  { date: "2026-03-24", value: 43780 },
  { date: "2026-03-25", value: 44100 },
  { date: "2026-03-26", value: 44050 },
  { date: "2026-03-27", value: 44380 },
  { date: "2026-03-28", value: 44720 },
  { date: "2026-03-29", value: 44900 },
  { date: "2026-03-30", value: 45210 },
  { date: "2026-03-31", value: 45480 },
  { date: "2026-04-01", value: 45750 },
  { date: "2026-04-02", value: 45600 },
  { date: "2026-04-03", value: 45980 },
  { date: "2026-04-04", value: 46320 },
  { date: "2026-04-05", value: 46510 },
  { date: "2026-04-06", value: 46480 },
  { date: "2026-04-07", value: 46820 },
  { date: "2026-04-08", value: 47100 },
  { date: "2026-04-09", value: 47350 },
  { date: "2026-04-10", value: 47280 },
  { date: "2026-04-11", value: 47620 },
  { date: "2026-04-12", value: 47890 },
  { date: "2026-04-13", value: 48020 },
  { date: "2026-04-14", value: 47960 },
  { date: "2026-04-15", value: 48180 },
  { date: "2026-04-16", value: 48340 },
  { date: "2026-04-17", value: 48420 },
  { date: "2026-04-18", value: 48250 },
];

const cannedActiveUsersTrend = [
  { date: "2026-03-20", value: 1840 },
  { date: "2026-03-21", value: 1520 },
  { date: "2026-03-22", value: 1490 },
  { date: "2026-03-23", value: 1920 },
  { date: "2026-03-24", value: 2040 },
  { date: "2026-03-25", value: 2110 },
  { date: "2026-03-26", value: 2080 },
  { date: "2026-03-27", value: 1950 },
  { date: "2026-03-28", value: 1610 },
  { date: "2026-03-29", value: 1570 },
  { date: "2026-03-30", value: 2020 },
  { date: "2026-03-31", value: 2140 },
  { date: "2026-04-01", value: 2180 },
  { date: "2026-04-02", value: 2150 },
  { date: "2026-04-03", value: 2030 },
  { date: "2026-04-04", value: 1690 },
  { date: "2026-04-05", value: 1640 },
  { date: "2026-04-06", value: 2080 },
  { date: "2026-04-07", value: 2200 },
  { date: "2026-04-08", value: 2240 },
  { date: "2026-04-09", value: 2210 },
  { date: "2026-04-10", value: 2100 },
  { date: "2026-04-11", value: 1740 },
  { date: "2026-04-12", value: 1680 },
  { date: "2026-04-13", value: 2130 },
  { date: "2026-04-14", value: 2250 },
  { date: "2026-04-15", value: 2290 },
  { date: "2026-04-16", value: 2260 },
  { date: "2026-04-17", value: 2184 },
  { date: "2026-04-18", value: 2184 },
];

const cannedChurnTrend = [
  3.8, 3.7, 3.9, 3.6, 3.5, 3.7, 3.5, 3.4, 3.6, 3.3, 3.4, 3.2, 3.3, 3.2,
];

const cannedConversionFunnel = [
  { stage: "Visitors", count: 18400 },
  { stage: "Signups", count: 3240 },
  { stage: "Activated", count: 1820 },
  { stage: "Paid", count: 900 },
];

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orgId = session.user.organizationId;

  try {
    const [
      activeSubAggregate,
      activeCustomerCount,
      planGroups,
      regionGroupsRaw,
      signupTotals,
      recentCustomers,
    ] = await Promise.all([
      // Sum active MRR
      db.subscription.aggregate({
        where: { customer: { organizationId: orgId }, status: "active" },
        _sum: { mrrCents: true },
      }),
      // Count active customers
      db.customer.count({
        where: { organizationId: orgId, status: "active" },
      }),
      // Revenue by plan (active subs only)
      db.subscription.groupBy({
        by: ["plan"],
        where: { customer: { organizationId: orgId }, status: "active" },
        _sum: { mrrCents: true },
      }),
      // Revenue by region (join through customer) — Prisma can't groupBy
      // across relations, so fetch sub+customer and aggregate in JS.
      db.subscription.findMany({
        where: { customer: { organizationId: orgId }, status: "active" },
        select: { mrrCents: true, customer: { select: { region: true } } },
      }),
      // Conversion = approved / total signup requests
      db.signupRequest.groupBy({
        by: ["state"],
        where: { organizationId: orgId },
        _count: true,
      }),
      // Recent signups: latest 5 customers
      db.customer.findMany({
        where: { organizationId: orgId },
        orderBy: { joinedAt: "desc" },
        take: 5,
        select: {
          id: true,
          contact: true,
          email: true,
          plan: true,
          status: true,
          joinedAt: true,
        },
      }),
    ]);

    // Aggregate revenue by region in JS
    const regionMap = new Map<string, number>();
    for (const row of regionGroupsRaw) {
      const region = row.customer.region;
      regionMap.set(region, (regionMap.get(region) ?? 0) + row.mrrCents);
    }
    const revenueByRegion = Array.from(regionMap.entries())
      .map(([region, cents]) => ({
        region,
        value: Math.round(cents / 100),
      }))
      .sort((a, b) => b.value - a.value);

    const revenueByPlan = planGroups
      .map((g) => ({
        plan: g.plan,
        value: Math.round((g._sum.mrrCents ?? 0) / 100),
      }))
      .filter((p) => p.value > 0);

    // Conversion: approved / total
    const totalSignups = signupTotals.reduce((sum, g) => sum + g._count, 0);
    const approvedSignups =
      signupTotals.find((g) => g.state === "approved")?._count ?? 0;
    const conversionPct =
      totalSignups > 0
        ? Math.round((approvedSignups / totalSignups) * 1000) / 10
        : 0;

    const payload: DashboardOverviewResponse = {
      kpis: {
        mrr: {
          value: Math.round((activeSubAggregate._sum.mrrCents ?? 0) / 100),
          deltaPct: 12.4,
        },
        activeUsers: {
          value: activeCustomerCount,
          deltaPct: 5.1,
        },
        churnRate: {
          value: 3.2,
          deltaPp: -0.6,
        },
        conversion: {
          value: conversionPct,
          deltaPp: 2.1,
        },
      },
      mrrTrend: cannedMrrTrend,
      activeUsersTrend: cannedActiveUsersTrend,
      revenueByPlan,
      revenueByRegion,
      conversionFunnel: cannedConversionFunnel,
      churnTrend: cannedChurnTrend,
      recentSignups: recentCustomers.map((c) => ({
        id: c.id,
        name: c.contact,
        email: c.email,
        plan: c.plan,
        status: c.status,
        joinedAt: c.joinedAt.toISOString().slice(0, 10),
      })),
    };

    return NextResponse.json(DashboardOverviewResponseSchema.parse(payload));
  } catch (err) {
    console.error("[GET /api/dashboard] DB error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
