import { z } from "zod";
import { CustomerPlanSchema } from "@/entities/customer";

/**
 * SignupRequest — wire format.
 *
 * WHY reuse CustomerPlanSchema:
 *   The "requested plan" vocabulary (Free/Pro/Enterprise) is identical
 *   to Customer.plan. Importing avoids duplicate enum definitions that
 *   could drift over time.
 */

export const SignupStateSchema = z.enum(["pending", "approved", "rejected"]);
export type SignupState = z.infer<typeof SignupStateSchema>;

export const SignupRequestSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  requestedPlan: CustomerPlanSchema,
  state: SignupStateSchema,
  signedUpAt: z.string(),
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const SignupRequestsListResponseSchema = z.object({
  signupRequests: z.array(SignupRequestSchema),
});
export type SignupRequestsListResponse = z.infer<
  typeof SignupRequestsListResponseSchema
>;
