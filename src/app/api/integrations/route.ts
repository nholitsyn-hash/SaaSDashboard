import { NextResponse } from "next/server";
import { auth } from "@/shared/api/auth";
import { db } from "@/shared/api/db";
import {
  IntegrationsListResponseSchema,
  type Integration,
} from "@/entities/integration";

/**
 * GET /api/integrations — workspace integrations + connection state.
 *
 * Order:
 *   - connected first (so the user sees their active integrations on top)
 *   - then alphabetical by name within each status group
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await db.integration.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });

    const integrations: Integration[] = rows.map((i) => ({
      id: i.id,
      slug: i.slug,
      name: i.name,
      category: i.category,
      description: i.description,
      status: i.status,
      connectedAt: i.connectedAt ? i.connectedAt.toISOString() : null,
    }));

    const payload = IntegrationsListResponseSchema.parse({ integrations });
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[GET /api/integrations] DB error:", err);
    return NextResponse.json(
      { error: "Failed to load integrations" },
      { status: 500 }
    );
  }
}
