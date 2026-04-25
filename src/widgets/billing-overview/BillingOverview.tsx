"use client";

import {
  ArrowUpRight,
  CreditCard,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, DataTable, type Column } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/utils/relative-time";
import {
  useBillingOverview,
  type CurrentPlan,
  type Invoice,
  type InvoiceStatus,
  type PaymentMethod,
  type UsageMetric,
} from "@/entities/billing";

/**
 * BillingOverview — wired to the live `/api/billing/overview` endpoint.
 *
 * WHY one query for the whole page:
 *   Plan + payment method + invoices render together; one round trip
 *   gives one loading state and one consistent snapshot of state.
 *
 * WHY every transactional button stays a Stripe-redirect toast:
 *   Real production delegates card entry, plan changes, and PDF
 *   retrieval to Stripe's hosted pages. Toasts here communicate the
 *   architecture intent — we surface data, Stripe owns transactions.
 */
export function BillingOverview() {
  const { data, isLoading, isError, error, refetch } = useBillingOverview();

  if (isLoading) {
    return (
      <p className="text-sm text-text-tertiary">Loading billing overview…</p>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-danger-subtle bg-danger-subtle/40 p-6">
        <p className="text-sm text-danger-text">
          {error?.message ?? "Failed to load billing overview"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PlanHero plan={data.plan} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PaymentMethodCard paymentMethod={data.paymentMethod} />
        <NeedHelpCard />
      </div>
      <InvoicesSection invoices={data.invoices} />
    </div>
  );
}

function PlanHero({ plan }: { plan: CurrentPlan }) {
  const handleChangePlan = () =>
    toast.info("Change plan", {
      description: "Redirects to Stripe Customer Portal in production",
    });

  return (
    <article className="rounded-xl border border-border-default bg-bg-surface shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border-default px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{plan.tier}</Badge>
            <span className="text-xs text-text-tertiary">
              {plan.cycle === "monthly" ? "Monthly" : "Annual"} billing
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-text-primary tabular-nums">
              ${plan.priceMonthly}
            </span>
            <span className="text-sm text-text-tertiary">/month</span>
          </div>
          <span className="text-xs text-text-secondary">
            Next invoice {formatRelativeTime(plan.renewsAt)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleChangePlan}
          className="
            inline-flex items-center gap-2 self-start
            rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
            shadow-sm transition-colors hover:bg-primary-hover
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus focus-visible:ring-offset-2
          "
        >
          Change plan
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
            Usage this cycle
          </h3>
          <span className="text-xs text-text-tertiary">
            Resets {formatRelativeTime(plan.nextBillAt)}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {plan.usage.map((u) => (
            <UsageRow key={u.label} metric={u} />
          ))}
        </div>
      </div>
    </article>
  );
}

function UsageRow({ metric }: { metric: UsageMetric }) {
  const pct = Math.min(100, (metric.used / metric.limit) * 100);
  const warn = pct >= 80;

  const fmt = (n: number) =>
    metric.unit
      ? `${n.toLocaleString("en-US")} ${metric.unit}`
      : n.toLocaleString("en-US");

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-text-secondary">{metric.label}</span>
        <span className="text-xs tabular-nums text-text-tertiary">
          <span
            className={`font-medium ${warn ? "text-warning-text" : "text-text-primary"}`}
          >
            {fmt(metric.used)}
          </span>{" "}
          / {fmt(metric.limit)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-muted">
        <div
          className={`h-full rounded-full transition-all ${warn ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PaymentMethodCard({
  paymentMethod,
}: {
  paymentMethod: PaymentMethod | null;
}) {
  const handleUpdate = () =>
    toast.info("Update payment method", {
      description: "Redirects to Stripe Customer Portal in production",
    });

  if (!paymentMethod) {
    return (
      <article className="rounded-xl border border-border-default bg-bg-surface p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-text-tertiary" />
          <h3 className="text-sm font-semibold text-text-primary">
            Payment method
          </h3>
        </div>
        <p className="text-xs text-text-secondary">
          No payment method on file. Add one to upgrade or extend trial.
        </p>
        <button
          type="button"
          onClick={handleUpdate}
          className="
            inline-flex items-center gap-1.5 self-start
            rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white
            transition-colors hover:bg-primary-hover
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus focus-visible:ring-offset-2
          "
        >
          Add payment method
          <ExternalLink size={12} />
        </button>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-border-default bg-bg-surface p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CreditCard size={16} className="text-text-tertiary" />
        <h3 className="text-sm font-semibold text-text-primary">
          Payment method
        </h3>
      </div>
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-bold text-white"
        >
          {paymentMethod.brand.toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-text-primary tabular-nums">
            •••• •••• •••• {paymentMethod.last4}
          </span>
          <span className="text-xs text-text-tertiary tabular-nums">
            Expires {String(paymentMethod.expMonth).padStart(2, "0")}/
            {paymentMethod.expYear}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleUpdate}
        className="
          inline-flex items-center gap-1.5 self-start
          rounded-md border border-border-default bg-bg-surface
          px-3 py-1.5 text-xs font-medium text-text-secondary
          transition-colors hover:bg-bg-muted hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        "
      >
        Update in Stripe
        <ExternalLink size={12} />
      </button>
    </article>
  );
}

function NeedHelpCard() {
  return (
    <article className="rounded-xl border border-border-default bg-bg-surface p-5 shadow-sm flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text-primary">Billing help</h3>
      <p className="text-xs text-text-secondary leading-relaxed">
        All invoices, tax documents, and payment history are stored in our
        Stripe Customer Portal. Use the &quot;Change plan&quot; or &quot;Update
        payment&quot; buttons to open the portal.
      </p>
      <button
        type="button"
        onClick={() =>
          toast.info("Stripe Customer Portal", {
            description: "Opens in a new tab in production",
          })
        }
        className="
          inline-flex items-center gap-1.5 self-start
          text-xs font-medium text-primary-text
          transition-colors hover:underline
          focus-visible:outline-none focus-visible:underline
        "
      >
        Open Stripe portal
        <ExternalLink size={12} />
      </button>
    </article>
  );
}

function InvoicesSection({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text-primary">Invoices</h2>
      <DataTable<Invoice>
        columns={invoiceColumns}
        rows={invoices}
        getRowKey={(row) => row.id}
        pagination={{
          page: 1,
          pageSize: invoices.length || 1,
          total: invoices.length,
        }}
        emptyState="No invoices yet"
      />
    </div>
  );
}

const invoiceStatusVariant: Record<
  InvoiceStatus,
  "success" | "danger" | "default"
> = {
  paid: "success",
  failed: "danger",
  upcoming: "default",
};

const invoiceColumns: Column<Invoice>[] = [
  {
    key: "number",
    header: "Invoice",
    render: (row) => (
      <span className="font-medium tabular-nums text-text-primary">
        {row.number}
      </span>
    ),
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (row) => (
      <span className="tabular-nums text-text-secondary">{row.date}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    align: "right",
    render: (row) => (
      <span className="tabular-nums font-medium">${row.amount}.00</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={invoiceStatusVariant[row.status]} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "",
    align: "right",
    render: (row) => (
      <button
        type="button"
        onClick={() =>
          toast.info(`Downloading ${row.number}`, {
            description: "Fetches the PDF from Stripe in production",
          })
        }
        aria-label={`Download ${row.number}`}
        className="
          inline-flex h-7 w-7 items-center justify-center rounded-md
          text-text-tertiary transition-colors
          hover:bg-bg-muted hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-border-focus
        "
      >
        <Download size={14} />
      </button>
    ),
  },
];
