import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";
import type { Role } from "@/shared/types/auth";

/**
 * Auth.js v5 configuration — the central auth nerve of the app.
 *
 * WHY in shared/api/:
 * The `auth()` function is infrastructure that every layer consumes —
 * middleware reads the session, API routes check permissions, layouts
 * pass session to providers. It's analogous to a fetch client or DB
 * connection. FSD's shared/api/ is described as "base fetch, query client."
 *
 * WHY JWT strategy (not database sessions):
 * The Credentials provider requires JWT. Auth.js intentionally does NOT
 * call the adapter's createSession() for credentials logins — this is
 * by design. JWT sessions are also faster (no DB lookup per request)
 * and work on Edge Runtime (middleware).
 */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email },
          include: {
            memberships: {
              select: { role: true, organizationId: true },
              take: 1,
            },
          },
        });

        if (!user?.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        const membership = user.memberships[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: membership?.role as Role | undefined,
          organizationId: membership?.organizationId,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback — fires on every request.
     *
     * WHY we only query DB when `user` is present:
     * The `user` param is only passed on initial sign-in (or session update).
     * On subsequent requests, the token already has role/orgId cached.
     * This avoids a DB query on every single page load.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      return token;
    },

    /**
     * Session callback — shapes what auth() returns to app code.
     *
     * WHY copy from token to session:
     * The JWT token is server-side only. The session object is what
     * gets serialized and sent to the client via SessionProvider.
     * We transfer role/orgId so both server and client code can
     * access them via session.user.role.
     */
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
