import type { Role } from "./auth";
import type { DefaultSession } from "next-auth";

/**
 * Module augmentation for Auth.js types.
 *
 * WHY this file exists:
 * Auth.js's default Session type only has { name, email, image }.
 * Our JWT callback adds `role` and `organizationId` to the token,
 * and our session callback copies them to the session. Without this
 * augmentation, TypeScript would error on `session.user.role`.
 *
 * This file extends the types globally — every call to `auth()`
 * or `useSession()` returns the extended types automatically.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      organizationId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    organizationId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    organizationId?: string;
  }
}
