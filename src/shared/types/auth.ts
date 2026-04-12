/**
 * Auth types — roles, permissions, session extensions.
 *
 * WHY string union + const array instead of just the Prisma enum:
 * The Prisma enum is generated code that lives in node_modules.
 * We define our own Role type so the rest of the app doesn't
 * depend on Prisma's generated output. If we ever swap ORMs,
 * only shared/api/db.ts changes — not every component that
 * checks roles.
 */

export type Role = "super_admin" | "admin" | "viewer";

/** All roles as a const array — useful for iteration and Zod enums. */
export const ROLES = ["super_admin", "admin", "viewer"] as const;

/**
 * Role hierarchy — higher number = more permissions.
 *
 * WHY a numeric hierarchy:
 * Checking "does this user have at least admin access?" becomes
 * a single comparison instead of a list of allowed roles.
 * This is the same pattern used by Unix file permissions.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  admin: 1,
  super_admin: 2,
};

/**
 * Check if a user's role meets the minimum required role.
 *
 * Example: hasMinRole("admin", "viewer") → true
 *          hasMinRole("viewer", "admin") → false
 */
export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
