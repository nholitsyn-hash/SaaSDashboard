"use client";

import { useSession as useAuthSession } from "next-auth/react";
import type { Role } from "@/shared/types/auth";
import { hasMinRole } from "@/shared/types/auth";

/**
 * useCurrentUser — typed wrapper around Auth.js useSession.
 *
 * WHY a wrapper instead of using useSession directly:
 * 1. Returns a simpler API: just the user object (or null) + loading state
 * 2. Type-safe: includes our custom fields (role, organizationId)
 * 3. Single import: components don't need to know about next-auth/react
 *
 * If the session is loading or unauthenticated, user is null.
 */
export function useCurrentUser() {
  const { data: session, status } = useAuthSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}

/**
 * useRequireRole — checks if the current user has at least the required role.
 *
 * Returns { authorized, isLoading } so components can show loading states
 * or redirect as needed. Does NOT redirect automatically — that's the
 * component's responsibility, keeping this hook pure and testable.
 *
 * WHY not redirect here:
 * Hooks that trigger navigation are hard to test and unpredictable.
 * The component knows best what to do (redirect, show 403, hide a button).
 */
export function useRequireRole(requiredRole: Role) {
  const { user, isLoading, isAuthenticated } = useCurrentUser();

  const authorized =
    isAuthenticated &&
    !!user?.role &&
    hasMinRole(user.role, requiredRole);

  return { authorized, isLoading, user };
}
