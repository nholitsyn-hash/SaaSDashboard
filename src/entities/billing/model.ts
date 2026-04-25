import { z } from "zod";
import { CustomerPlanSchema } from "@/entities/customer";
import { BillingCycleSchema } from "@/entities/subscription";

/**
 * Billing — wire format for the BillingOverview page.
 *
 * WHY one combined response (plan + usage + payment + invoices) — not three:
 *   The page renders all four sections together; splitting forces 3
 *   independent loading states + 3 round trips. One endpoint = one cache
 *   entry, one loading state, one easy refetch on plan change.
 *
 * WHY usage as an array of {label, used, limit, unit?}:
 *   The widget renders metrics generically. Adding a new metric (API
 *   calls / etc.) is a server-side push, no client schema change needed.
 *
 * WHY paymentMethod can be null:
 *   Trial accounts and Free plans don't have a card on file. UI shows an
 *   "Add payment method" CTA for the null case.
 */

export const UsageMetricSchema = z.object({
  label: z.string(),
  used: z.number().nonnegative(),
  limit: z.number().nonnegative(),
  unit: z.string().optional(),
});
export type UsageMetric = z.infer<typeof UsageMetricSchema>;

export const CurrentPlanSchema = z.object({
  name: z.string(),
  tier: CustomerPlanSchema,
  priceMonthly: z.number().int().nonnegative(),
  cycle: BillingCycleSchema,
  nextBillAt: z.string(), // ISO datetime
  renewsAt: z.string(), // ISO datetime
  usage: z.array(UsageMetricSchema),
});
export type CurrentPlan = z.infer<typeof CurrentPlanSchema>;

export const CardBrandSchema = z.enum(["Visa", "Mastercard", "Amex"]);
export type CardBrand = z.infer<typeof CardBrandSchema>;

export const PaymentMethodSchema = z.object({
  brand: CardBrandSchema,
  last4: z.string(),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int(),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const InvoiceStatusSchema = z.enum(["paid", "failed", "upcoming"]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  date: z.string(), // ISO yyyy-mm-dd
  amount: z.number().int().nonnegative(),
  status: InvoiceStatusSchema,
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const BillingOverviewResponseSchema = z.object({
  plan: CurrentPlanSchema,
  paymentMethod: PaymentMethodSchema.nullable(),
  invoices: z.array(InvoiceSchema),
});
export type BillingOverviewResponse = z.infer<
  typeof BillingOverviewResponseSchema
>;
