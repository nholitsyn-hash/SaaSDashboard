"use server";

import { signIn } from "@/shared/api/auth";
import { loginSchema } from "../model/login-schema";
import { AuthError } from "next-auth";

/**
 * Server Action for credentials login.
 *
 * WHY a Server Action instead of a fetch call:
 * Server Actions are Next.js's native RPC mechanism. They:
 *   1. Run on the server — no API route needed
 *   2. Automatically handle CSRF protection
 *   3. Can be called directly from form onSubmit
 *   4. Work with progressive enhancement (form works without JS)
 *
 * WHY we catch AuthError specifically:
 * Auth.js throws AuthError subtypes (CredentialsSignin, etc.)
 * for known auth failures. We catch those and return a user-friendly
 * message. Unknown errors re-throw so they surface in error boundaries.
 */
export async function loginAction(
  formData: FormData
): Promise<{ error?: string }> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });

    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    // NEXT_REDIRECT is thrown by signIn on success — let it propagate
    throw error;
  }
}
