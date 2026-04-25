import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  BillingOverviewResponseSchema,
  type BillingOverviewResponse,
} from "@/entities/billing";

/**
 * GET /api/billing/overview — plan + usage + payment method + invoices
 * for the current org. One round trip serves the whole page.
 *
 * WHY 404 if no WorkspaceSubscription exists:
 *   In production every org has one (created on signup). For mock data
 *   it's possible to skip seeding billing — make the failure explicit
 *   instead of returning a half-empty page.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sub = await db.workspaceSubscription.findUnique({
      where: { organizationId: session.user.organizationId },
      include: {
        invoices: { orderBy: { date: "desc" } },
      },
    });

    if (!sub) {
      return NextResponse.json(
        { error: "No billing record found for this workspace" },
        { status: 404 }
      );
    }

    const payload: BillingOverviewResponse = {
      plan: {
        name: sub.planName,
        tier: sub.planTier,
        priceMonthly: Math.round(sub.priceMonthlyCents / 100),
        cycle: sub.cycle,
        nextBillAt: sub.nextBillAt.toISOString(),
        renewsAt: sub.renewsAt.toISOString(),
        usage: [
          {
            label: "Events tracked",
            used: sub.eventsUsed,
            limit: sub.eventsLimit,
          },
          {
            label: "Team seats",
            used: sub.seatsUsed,
            limit: sub.seatsLimit,
          },
          {
            label: "Storage",
            used: sub.storageUsedGb,
            limit: sub.storageLimitGb,
            unit: "GB",
          },
        ],
      },
      paymentMethod:
        sub.cardBrand && sub.cardLast4 && sub.cardExpMonth && sub.cardExpYear
          ? {
              brand: sub.cardBrand,
              last4: sub.cardLast4,
              expMonth: sub.cardExpMonth,
              expYear: sub.cardExpYear,
            }
          : null,
      invoices: sub.invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        date: inv.date.toISOString().slice(0, 10),
        amount: Math.round(inv.amountCents / 100),
        status: inv.status,
      })),
    };

    return NextResponse.json(BillingOverviewResponseSchema.parse(payload));
  } catch (err) {
    console.error("[GET /api/billing/overview] DB error:", err);
    return NextResponse.json(
      { error: "Failed to load billing overview" },
      { status: 500 }
    );
  }
}
