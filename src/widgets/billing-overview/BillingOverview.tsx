"use client";

import { ArrowUpRight, CreditCard, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge, DataTable, type Column } from "@/shared/ui";
import {
  currentPlan,
  mockInvoices,
  paymentMethod,
  type Invoice,
  type InvoiceStatus,
  type UsageMetric,
} from "./mock";

/**
 * BillingOverview — realistic "our own billing" page.
 *
 * WHY every transactional button fires "Redirects to Stripe Customer
 * Portal" toast instead of opening a form:
 * Real production flow delegates card entry, plan changes, and invoice
 * retrieval to Stripe's hosted pages — PCI compliance lives there.
 * This mock replicates that boundary: we surface the data, Stripe owns
 * the transactions.
 *
 * WHY usage meters beside the plan hero (not a separate card):
 * Usage is the quickest signal for "do I need to upgrade?" — putting it
 * at the top of the plan card is where eyes land first.
 */
export function BillingOverview() {
  return (
    <div className="flex flex-col gap-6">
      <PlanHero />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PaymentMethodCard />
        <NeedHelpCard />
      </div>
      <InvoicesSection />
    </div>
  );
}

function PlanHero() {
  const handleChangePlan = () =>
    toast.info("Change plan", {
      description: "Redirects to Stripe Customer Portal in production",
    });

  return (
    <article className="rounded-xl border border-border-default bg-bg-surface shadow-sm overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border-default px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{currentPlan.slug}</Badge>
            <span className="text-xs text-text-tertiary">
              {currentPlan.cycle === "monthly" ? "Monthly" : "Annual"} billing
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-semibold text-text-primary tabular-nums">
              ${currentPlan.priceMonthly}
            </span>
            <span className="text-sm text-text-tertiary">/month</span>
          </div>
          <span className="text-xs text-text-secondary">
            Next invoice {currentPlan.renewsOn}
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
            Resets {currentPlan.nextBillDate}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {currentPlan.usage.map((u) => (
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

function PaymentMethodCard() {
  const handleUpdate = () =>
    toast.info("Update payment method", {
      description: "Redirects to Stripe Customer Portal in production",
    });

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
        Stripe Customer Portal. Use the "Change plan" or "Update payment"
        buttons to open the portal.
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

function InvoicesSection() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text-primary">Invoices</h2>
      <DataTable<Invoice>
        columns={invoiceColumns}
        rows={mockInvoices}
        getRowKey={(row) => row.id}
        pagination={{
          page: 1,
          pageSize: mockInvoices.length,
          total: mockInvoices.length,
        }}
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
