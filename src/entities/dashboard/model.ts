import { z } from "zod";

/**
 * Dashboard — wire format for the all-in-one dashboard endpoint.
 *
 * WHY one combined response (KPIs + 6 charts + signups table):
 *   The dashboard page renders all of these together; one round trip =
 *   one cache entry, one consistent snapshot. With ~7 widgets sharing
 *   the cache via TanStack dedup, multiple renders cost zero extra fetches.
 *
 * WHY some metrics are real-from-DB and some canned:
 *   Time-series metrics (MRR over 30 days, active users over time, churn
 *   sparkline, conversion funnel) need a `DailyMetric` snapshot table
 *   that we don't have yet — that's a Phase 7 / production concern.
 *   For now those slices are canned in the API route. Aggregates we CAN
 *   compute right now (revenue by plan/region, recent signups, current
 *   MRR) come straight from Prisma. Widgets don't know the difference —
 *   they just consume the wire format.
 */

export const KpiNumberSchema = z.object({
  value: z.number(),
  /** Percent change vs previous period (e.g. +12.4 → "+12.4%"). */
  deltaPct: z.number().optional(),
  /** Percentage-point change (for rate metrics like churn / conversion). */
  deltaPp: z.number().optional(),
});
export type KpiNumber = z.infer<typeof KpiNumberSchema>;

export const DashboardKpisSchema = z.object({
  mrr: KpiNumberSchema,
  activeUsers: KpiNumberSchema,
  churnRate: KpiNumberSchema,
  conversion: KpiNumberSchema,
});
export type DashboardKpis = z.infer<typeof DashboardKpisSchema>;

export const TimeseriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});
export type TimeseriesPoint = z.infer<typeof TimeseriesPointSchema>;

export const PlanRevenueSchema = z.object({
  plan: z.string(),
  value: z.number().int().nonnegative(),
});
export type PlanRevenue = z.infer<typeof PlanRevenueSchema>;

export const RegionRevenueSchema = z.object({
  region: z.string(),
  value: z.number().int().nonnegative(),
});
export type RegionRevenue = z.infer<typeof RegionRevenueSchema>;

export const FunnelStageSchema = z.object({
  stage: z.string(),
  count: z.number().int().nonnegative(),
});
export type FunnelStage = z.infer<typeof FunnelStageSchema>;

export const RecentSignupSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  plan: z.string(),
  status: z.enum(["active", "trial", "churned"]),
  joinedAt: z.string(),
});
export type RecentSignup = z.infer<typeof RecentSignupSchema>;

export const DashboardOverviewResponseSchema = z.object({
  kpis: DashboardKpisSchema,
  mrrTrend: z.array(TimeseriesPointSchema),
  activeUsersTrend: z.array(TimeseriesPointSchema),
  revenueByPlan: z.array(PlanRevenueSchema),
  revenueByRegion: z.array(RegionRevenueSchema),
  conversionFunnel: z.array(FunnelStageSchema),
  churnTrend: z.array(z.number()),
  recentSignups: z.array(RecentSignupSchema),
});
export type DashboardOverviewResponse = z.infer<
  typeof DashboardOverviewResponseSchema
>;
