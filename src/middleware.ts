import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasMinRole, type Role } from "@/shared/types/auth";

/**
 * Role-based route protection middleware.
 *
 * WHY getToken() instead of auth():
 * Middleware runs on the Edge Runtime, which doesn't support Node.js
 * modules (node:path, node:url, etc.). Our auth config imports
 * Prisma, which uses Node.js APIs. Instead, we use getToken() from
 * next-auth/jwt — it only decodes the JWT cookie using pure crypto,
 * no database, no Node.js APIs. Same session data, Edge-compatible.
 *
 * WHY middleware instead of per-page checks:
 * Middleware runs before the page even starts rendering.
 * An unauthorized user never loads the page JS, never triggers
 * server components, never hits the database. Fastest possible rejection.
 *
 * Route protection matrix:
 *   /login          → public (redirect to /dashboard if logged in)
 *   /dashboard/**   → any authenticated user
 *   /admin/**       → super_admin only
 *   /api/auth/**    → public (Auth.js handles internally)
 *   /api/**         → authenticated (returns 401 JSON)
 *   everything else → public (landing page, showcase, static assets)
 */

const PUBLIC_ROUTES = ["/login", "/register"];
const AUTH_API_PREFIX = "/api/auth";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const pathname = req.nextUrl.pathname;

  // Always let Auth.js API routes through
  if (pathname.startsWith(AUTH_API_PREFIX)) {
    return NextResponse.next();
  }

  // Public routes: redirect to dashboard if already logged in
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected API routes: return 401 JSON (no redirect for API calls)
  if (pathname.startsWith("/api/")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin routes: require super_admin role
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const role = token.role as Role | undefined;
    if (!role || !hasMinRole(role, "super_admin")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Dashboard and other protected routes: require any authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Everything else (landing page, showcase, etc.) — public
  return NextResponse.next();
}

/**
 * Matcher config — skip static assets and Next.js internals.
 *
 * WHY this pattern:
 * Without a matcher, middleware runs on EVERY request including
 * images, fonts, and webpack chunks. This regex excludes those,
 * so middleware only fires for actual page/API navigations.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
