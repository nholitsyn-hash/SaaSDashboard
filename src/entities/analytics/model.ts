import { z } from "zod";

/**
 * Analytics — wire format for the deep-metrics page.
 *
 * WHY one combined response:
 *   The page renders 4 KPIs + heatmap + 3 charts together. One endpoint =
 *   one cache entry, one loading state. Same pattern as the dashboard.
 *
 * WHY some metrics canned in the route (cohort retention, MRR movement,
 *   KPIs):
 *   These need time-series data we don't yet store. A `DailyMetric` /
 *   `MrrMovementEvent` table is its own production concern. Until then,
 *   the wire format is identical to what real data will produce — widgets
 *   don't know the difference.
 */

export const AnalyticsKpiSchema = z.object({
  value: z.string(), // pre-formatted display string
  delta: z.string(), // e.g. "+8.3%" or "-0.4 mo"
  trend: z.enum(["up", "down", "neutral"]),
  label: z.string(),
});
export type AnalyticsKpi = z.infer<typeof AnalyticsKpiSchema>;

export const AnalyticsKpisSchema = z.object({
  ltv: AnalyticsKpiSchema,
  cac: AnalyticsKpiSchema,
  paybackMonths: AnalyticsKpiSchema,
  netRevenueRetention: AnalyticsKpiSchema,
});
export type AnalyticsKpis = z.infer<typeof AnalyticsKpisSchema>;

export const CohortRetentionSchema = z.object({
  monthLabels: z.array(z.string()),
  cohorts: z.array(
    z.object({
      cohort: z.string(),
      retention: z.array(z.number().nullable()),
    })
  ),
});
export type CohortRetention = z.infer<typeof CohortRetentionSchema>;

export const MrrMovementRowSchema = z.object({
  month: z.string(),
  new: z.number(),
  expansion: z.number(),
  contraction: z.number(),
  churn: z.number(),
});
export type MrrMovementRow = z.infer<typeof MrrMovementRowSchema>;

export const PlanLtvSchema = z.object({
  plan: z.string(),
  value: z.number().int().nonnegative(),
});
export type PlanLtv = z.infer<typeof PlanLtvSchema>;

export const CustomerSegmentSchema = z.object({
  segment: z.enum(["SMB", "Mid-Market", "Enterprise"]),
  share: z.number().int().min(0).max(100),
});
export type CustomerSegment = z.infer<typeof CustomerSegmentSchema>;

export const AnalyticsResponseSchema = z.object({
  kpis: AnalyticsKpisSchema,
  cohortRetention: CohortRetentionSchema,
  mrrMovement: z.array(MrrMovementRowSchema),
  ltvByPlan: z.array(PlanLtvSchema),
  customerSegments: z.array(CustomerSegmentSchema),
});
export type AnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;
