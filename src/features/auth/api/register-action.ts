"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import { registerSchema } from "../model/register-schema";

/**
 * Server Action for credentials registration.
 *
 * WHY a Server Action (not REST):
 *   Same reasoning as `login-action`: native to Next 16, no API route
 *   needed, automatic CSRF, can be called directly from `<form action>`.
 *
 * WHY user + org + membership in a transaction:
 *   These three writes are inseparable — partial state (a User without
 *   a Membership) is broken. `db.$transaction` rolls all three back if
 *   any single insert fails.
 *
 * WHY a slug-collision retry loop:
 *   `Organization.slug` is unique. Two users registering "Acme Corp" at
 *   the same time would conflict. We slugify, then on collision append
 *   a random 4-digit suffix. 5 retries is generous; production-grade
 *   would use cuid-based slugs but those read worse in URLs.
 *
 * WHY auto-signIn after create:
 *   Prevents the "register, then have to type credentials again" friction.
 *   `signIn` throws NEXT_REDIRECT on success — we let that propagate so
 *   Next.js handles the redirect to /dashboard.
 */
export async function registerAction(
  formData: FormData
): Promise<{ error?: string }> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password, companyName } = parsed.data;

  // Check email uniqueness BEFORE the transaction so we return a clean
  // error, not a Prisma constraint violation.
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: "An account with this email already exists. Try signing in.",
    };
  }

  // Generate a unique organization slug.
  let slug = slugify(companyName);
  for (let attempt = 0; attempt < 5; attempt++) {
    const collision = await db.organization.findUnique({ where: { slug } });
    if (!collision) break;
    slug = `${slugify(companyName)}-${randomSuffix()}`;
    if (attempt === 4) {
      return {
        error: "Could not provision your workspace. Please try again.",
      };
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, name, passwordHash },
    });
    const org = await tx.organization.create({
      data: { name: companyName, slug },
    });
    await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: "super_admin",
      },
    });
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          "Account created. Please sign in with your credentials.",
      };
    }
    // NEXT_REDIRECT — propagate so the framework handles redirect.
    throw error;
  }
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "workspace"
  );
}

function randomSuffix(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
