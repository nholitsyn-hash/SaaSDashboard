import { z } from "zod";

/**
 * Customer — wire-format schema + type.
 *
 * WHY separate from Prisma's generated type:
 * Prisma's type reflects the DB shape (mrrCents, DateTime objects).
 * The WIRE format is what the API returns and the client consumes —
 * dollars instead of cents, ISO-date strings instead of Date objects
 * (JSON can't carry Date). Keeping this schema in entities/ means
 * widgets import from a stable surface; the API is free to change
 * its internal query shape without breaking callers.
 *
 * WHY Zod (not just a TS type):
 * The same schema guards BOTH ends — the server validates its response
 * before sending, the client validates after parsing. If the shapes
 * ever drift (a migration tweaks a column name, an enum member is
 * added), Zod catches it at the boundary instead of propagating bad
 * data silently through the UI.
 */

export const CustomerPlanSchema = z.enum(["Free", "Pro", "Enterprise"]);
export type CustomerPlan = z.infer<typeof CustomerPlanSchema>;

export const CustomerStatusSchema = z.enum(["active", "trial", "churned"]);
export type CustomerStatus = z.infer<typeof CustomerStatusSchema>;

export const CustomerSchema = z.object({
  id: z.string(),
  company: z.string(),
  contact: z.string(),
  email: z.string().email(),
  plan: CustomerPlanSchema,
  status: CustomerStatusSchema,
  mrr: z.number().int().nonnegative(),
  region: z.string(),
  /** ISO yyyy-mm-dd, matching how the UI renders joined dates. */
  joinedAt: z.string(),
});
export type Customer = z.infer<typeof CustomerSchema>;

export const CustomersListResponseSchema = z.object({
  customers: z.array(CustomerSchema),
});
export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;
