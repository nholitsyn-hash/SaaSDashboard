import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import type { Subscription } from "@/entities/subscription";

/**
 * GET /api/subscriptions
 *
 * Returns every subscription whose customer belongs to the logged-in
 * user's organization.
 *
 * WHY filter via `customer: { organizationId }` (nested relation):
 *   Subscription rows don't store organizationId directly — they belong
 *   to a Customer which belongs to an Organization. Prisma lets us
 *   constrain across the relation in a single query. No manual
 *   "fetch customers first" round trip needed.
 *
 * WHY include only `{ customer: { select: { company: true } } }`:
 *   The UI needs the company name to render — not the whole Customer.
 *   Selecting just one column is cheaper than pulling every customer
 *   column over the wire. Prisma's `select` short-circuits unwanted data.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.subscription.findMany({
      where: { customer: { organizationId: session.user.organizationId } },
      include: { customer: { select: { company: true } } },
      orderBy: [{ mrrCents: "desc" }, { startedAt: "desc" }],
    });

    const subscriptions: Subscription[] = rows.map((r) => ({
      id: r.id,
      customer: r.customer.company,
      plan: r.plan,
      cycle: r.cycle,
      status: r.status,
      mrr: Math.round(r.mrrCents / 100),
      startedAt: r.startedAt.toISOString().slice(0, 10),
      renewsAt: r.renewsAt ? r.renewsAt.toISOString().slice(0, 10) : null,
    }));

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("[GET /api/subscriptions] DB error:", error);
    return NextResponse.json(
      { error: "Failed to load subscriptions" },
      { status: 500 }
    );
  }
}
