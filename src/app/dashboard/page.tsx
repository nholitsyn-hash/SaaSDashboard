import { auth } from "@/shared/api/auth";
import { Typography } from "@/shared/ui";
import { redirect } from "next/navigation";

/**
 * Dashboard page — placeholder until Phase 3.
 *
 * Uses auth() server-side to get the session and display
 * the logged-in user's info. This proves the full auth
 * pipeline works: login → JWT → session → server component.
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <Typography variant="h2">Dashboard</Typography>
        <Typography variant="body">
          Welcome, {session.user.name ?? session.user.email}
        </Typography>
        <Typography variant="body-sm">
          Role: {session.user.role} | Org: {session.user.organizationId}
        </Typography>
        <Typography variant="caption">
          Phase 3 will replace this with KPI cards and charts.
        </Typography>
      </div>
    </main>
  );
}
