import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import type { Customer } from "@/entities/customer";

/**
 * GET /api/customers
 *
 * Returns every customer belonging to the logged-in user's organization.
 *
 * WHY auth() here in addition to the edge proxy:
 * proxy.ts does a fast JWT check to keep unauthenticated traffic from
 * reaching app code. This is Node runtime — we can (and should)
 * re-verify via auth() because:
 *   1. proxy.ts redirects but API routes return 401 JSON; clearer error
 *      shape from here
 *   2. We need `session.user.organizationId` for the multi-tenant filter
 *   3. Defense-in-depth: if proxy matcher changes, we don't silently
 *      become a public endpoint
 *
 * WHY filter by organizationId (not userId):
 * Customers belong to workspaces, not users. Every member of an org sees
 * the same customer list. This is THE multi-tenancy boundary — without
 * it, user A could query user B's data.
 *
 * WHY convert mrrCents → mrr dollars at the boundary:
 * DB stores cents (correct, precise). UI consumes dollars (what we
 * display). Making the conversion here means no client code ever
 * touches cents — mental model stays clean.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.customer.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: [{ mrrCents: "desc" }, { joinedAt: "desc" }],
    });

    const customers: Customer[] = rows.map((r) => ({
      id: r.id,
      company: r.company,
      contact: r.contact,
      email: r.email,
      plan: r.plan,
      status: r.status,
      mrr: Math.round(r.mrrCents / 100),
      region: r.region,
      joinedAt: r.joinedAt.toISOString().slice(0, 10),
    }));

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("[GET /api/customers] DB error:", error);
    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    );
  }
}
