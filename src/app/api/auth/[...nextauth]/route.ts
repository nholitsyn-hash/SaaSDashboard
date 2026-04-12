/**
 * Auth.js catch-all route handler.
 *
 * WHY this is so minimal:
 * All auth logic lives in shared/api/auth.ts. This file is pure
 * plumbing — it just wires the Auth.js handlers to the Next.js
 * App Router. Aligns with FSD: app/ = routing only, no business logic.
 *
 * Auth.js v5 handles these routes automatically:
 *   GET  /api/auth/signin
 *   POST /api/auth/signin/:provider
 *   POST /api/auth/signout
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 */
import { handlers } from "@/shared/api/auth";

export const { GET, POST } = handlers;
