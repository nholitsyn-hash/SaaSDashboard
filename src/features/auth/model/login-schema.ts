import { z } from "zod";

/**
 * Login form validation schema.
 *
 * WHY Zod here and in auth.ts:
 * This schema is for the client-side form — it provides
 * user-friendly error messages before the request is sent.
 * The schema in auth.ts (authorize callback) is the server-side
 * gate — it validates even if someone bypasses the form.
 * Defense in depth: validate at every boundary.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
