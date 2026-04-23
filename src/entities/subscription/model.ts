import { z } from "zod";

/**
 * Subscription — wire format. Same ideas as the Customer entity:
 * mrrCents → mrr dollars at the boundary, Date → yyyy-mm-dd string,
 * nullable renewsAt stays null (UI renders "—").
 */

export const SubPlanSchema = z.enum(["Pro", "Enterprise"]);
export type SubPlan = z.infer<typeof SubPlanSchema>;

export const SubStatusSchema = z.enum([
  "active",
  "trial",
  "paused",
  "canceled",
]);
export type SubStatus = z.infer<typeof SubStatusSchema>;

export const BillingCycleSchema = z.enum(["monthly", "annual"]);
export type BillingCycle = z.infer<typeof BillingCycleSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  /** Customer company name — denormalized into the payload for display. */
  customer: z.string(),
  plan: SubPlanSchema,
  cycle: BillingCycleSchema,
  status: SubStatusSchema,
  mrr: z.number().int().nonnegative(),
  startedAt: z.string(),
  renewsAt: z.string().nullable(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionsListResponseSchema = z.object({
  subscriptions: z.array(SubscriptionSchema),
});
export type SubscriptionsListResponse = z.infer<
  typeof SubscriptionsListResponseSchema
>;
