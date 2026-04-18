import { auth } from "@/shared/api/auth";
import {
  Badge,
  ChartCard,
  Column,
  DataTable,
  Input,
  KpiCard,
  Typography,
} from "@/shared/ui";
import { redirect } from "next/navigation";

/**
 * Dashboard — Phase 3 in progress.
 *
 * This iteration previews the three shared/ui primitives (KpiCard, ChartCard,
 * DataTable) with mock data. Step 3 replaces the ChartCard placeholder with
 * real ECharts widgets; Step 5 finalizes layout + responsive + real mock data.
 */

interface Signup {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "trial" | "active" | "churned";
  joinedAt: string;
}

const mockSignups: Signup[] = [
  { id: "1", name: "Emma Carter", email: "emma@acme.co", plan: "Pro", status: "active", joinedAt: "2026-04-17" },
  { id: "2", name: "Liam Walsh", email: "liam@northwind.io", plan: "Enterprise", status: "active", joinedAt: "2026-04-17" },
  { id: "3", name: "Sophia Reed", email: "sophia@lab.dev", plan: "Free", status: "trial", joinedAt: "2026-04-16" },
  { id: "4", name: "Noah Bennett", email: "noah@mailbox.co", plan: "Pro", status: "trial", joinedAt: "2026-04-16" },
  { id: "5", name: "Olivia Hughes", email: "olivia@corp.io", plan: "Enterprise", status: "churned", joinedAt: "2026-04-15" },
];

const planVariant: Record<Signup["plan"], "default" | "primary" | "secondary"> = {
  Free: "default",
  Pro: "primary",
  Enterprise: "secondary",
};

const statusVariant: Record<Signup["status"], "success" | "warning" | "danger"> = {
  active: "success",
  trial: "warning",
  churned: "danger",
};

const signupColumns: Column<Signup>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (row) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{row.name}</span>
        <span className="text-xs text-text-tertiary">{row.email}</span>
      </div>
    ),
  },
  {
    key: "plan",
    header: "Plan",
    render: (row) => <Badge variant={planVariant[row.plan]}>{row.plan}</Badge>,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
    ),
  },
  {
    key: "joinedAt",
    header: "Joined",
    sortable: true,
    align: "right",
    render: (row) => <span className="tabular-nums">{row.joinedAt}</span>,
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-bg-base p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Dashboard</Typography>
          <Typography variant="body-sm">
            SaaS performance overview — {session.user.name ?? session.user.email}
          </Typography>
        </header>

        <section
          aria-label="Key metrics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <KpiCard
            label="MRR"
            value="$48,250"
            delta={{ value: "+12.4%", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="Active Users"
            value="2,184"
            delta={{ value: "+5.1%", trend: "up", label: "vs last month" }}
          />
          <KpiCard
            label="Churn Rate"
            value="3.2%"
            delta={{ value: "-0.4%", trend: "down", label: "vs last month" }}
          />
          <KpiCard
            label="Trial → Paid"
            value="27.8%"
            delta={{ value: "+2.1%", trend: "up", label: "vs last month" }}
          />
        </section>

        <section
          aria-label="Charts"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <ChartCard title="Monthly Recurring Revenue" subtitle="Last 30 days">
            <ChartPlaceholder label="MRR line chart — Step 3" />
          </ChartCard>
          <ChartCard title="Active Users" subtitle="Daily, last 30 days">
            <ChartPlaceholder label="Area chart — Step 3" />
          </ChartCard>
        </section>

        <section aria-label="Recent signups">
          <DataTable<Signup>
            columns={signupColumns}
            rows={mockSignups}
            getRowKey={(row) => row.id}
            toolbar={
              <>
                <h3 className="text-sm font-semibold text-text-primary">
                  Recent Signups
                </h3>
                <div className="w-64">
                  <Input placeholder="Filter by name or email…" />
                </div>
              </>
            }
            pagination={{ page: 1, pageSize: 5, total: 42 }}
          />
        </section>
      </div>
    </main>
  );
}

function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border-default bg-bg-muted/40 text-sm text-text-tertiary">
      {label}
    </div>
  );
}
