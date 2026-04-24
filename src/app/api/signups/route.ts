import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import type { SignupRequest } from "@/entities/signup-request";

/**
 * GET /api/signups
 *
 * Returns every signup request in the logged-in user's organization.
 * Sorted by most-recent first so reviewers tackle the freshest requests.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.signupRequest.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: [{ signedUpAt: "desc" }],
    });

    const signupRequests: SignupRequest[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      company: r.company,
      requestedPlan: r.requestedPlan,
      state: r.state,
      signedUpAt: r.signedUpAt.toISOString().slice(0, 10),
    }));

    return NextResponse.json({ signupRequests });
  } catch (error) {
    console.error("[GET /api/signups] DB error:", error);
    return NextResponse.json(
      { error: "Failed to load signups" },
      { status: 500 }
    );
  }
}
