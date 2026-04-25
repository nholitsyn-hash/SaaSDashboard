import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  TeamInvitesListResponseSchema,
  type TeamInvite,
} from "@/entities/team";

/**
 * GET /api/team/invites — pending invitations for the current org.
 *
 * WHY filter by status="pending" (not return all):
 *   Accepted/revoked/expired invites are historical data. The team page
 *   only cares about open invitations. A separate endpoint can serve
 *   audit history later.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.invitation.findMany({
      where: {
        organizationId: session.user.organizationId,
        status: "pending",
      },
      include: {
        invitedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const invites: TeamInvite[] = rows.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      invitedBy: inv.invitedBy.name ?? inv.invitedBy.email,
      sentAt: inv.createdAt.toISOString(),
      expiresAt: inv.expiresAt.toISOString(),
    }));

    const payload = TeamInvitesListResponseSchema.parse({ invites });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[GET /api/team/invites] DB error:", err);
    return NextResponse.json(
      { error: "Failed to load invitations" },
      { status: 500 }
    );
  }
}
