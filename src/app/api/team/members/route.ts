import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  TeamMembersListResponseSchema,
  type TeamMember,
  type TeamRole,
} from "@/entities/team";

/**
 * GET /api/team/members — list workspace members for the current org.
 *
 * WHY query Membership (not User):
 *   Memberships ARE the multi-tenant join — User exists once globally,
 *   Membership says "this user has role X in org Y". Filtering by org
 *   on Membership is the right boundary.
 *
 * WHY ORDER BY role then name:
 *   Roles have a natural hierarchy (super_admin → admin → viewer);
 *   showing them in that order matches the mental model of "who has
 *   most power" without needing a UI sort. Within a role, alphabetical.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const memberships = await db.membership.findMany({
      where: { organizationId: session.user.organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            lastActiveAt: true,
          },
        },
      },
    });

    // Role-then-name client-friendly sort.
    const roleRank: Record<TeamRole, number> = {
      super_admin: 0,
      admin: 1,
      viewer: 2,
    };
    memberships.sort((a, b) => {
      const r = roleRank[a.role] - roleRank[b.role];
      if (r !== 0) return r;
      return (a.user.name ?? "").localeCompare(b.user.name ?? "");
    });

    const members: TeamMember[] = memberships.map((m) => ({
      id: m.user.id,
      name: m.user.name ?? m.user.email,
      email: m.user.email,
      role: m.role,
      lastActiveAt: m.user.lastActiveAt ? m.user.lastActiveAt.toISOString() : null,
    }));

    const payload = TeamMembersListResponseSchema.parse({ members });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[GET /api/team/members] DB error:", err);
    return NextResponse.json(
      { error: "Failed to load team members" },
      { status: 500 }
    );
  }
}
