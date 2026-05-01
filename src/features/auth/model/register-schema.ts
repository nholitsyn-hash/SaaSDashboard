import { z } from "zod";

/**
 * Register form validation schema.
 *
 * WHY shared between client + server:
 *   The same schema runs in the form (Zod-friendly UX errors) and in
 *   the Server Action (authoritative validation that can't be bypassed).
 *   Defense in depth at every boundary.
 *
 * WHY companyName at signup:
 *   We're multi-tenant — every user is a member of an Organization.
 *   On register, we create a new Organization for them and make them
 *   its super_admin. Asking for companyName at signup mirrors how real
 *   B2B SaaS onboards (Linear, Stripe, etc.) and saves a follow-up step.
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
