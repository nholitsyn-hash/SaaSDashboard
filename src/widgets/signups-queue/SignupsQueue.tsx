"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, DataTable, Tabs, type Column } from "@/shared/ui";
import type { CustomerPlan } from "@/entities/customer";
import {
  useSignupRequests,
  type SignupRequest,
  type SignupState,
} from "@/entities/signup-request";

/**
 * SignupsQueue — pending-first queue with inline approve/reject actions.
 *
 * Pass 1 (now): live data from /api/signups. Approve/Reject buttons still
 * fire toasts only — they'll be wired to mutations when we build the
 * approval flow (separate step).
 */

const planVariant: Record<CustomerPlan, "default" | "primary" | "secondary"> = {
  Free: "default",
  Pro: "primary",
  Enterprise: "secondary",
};

function useColumns(state: SignupState): Column<SignupRequest>[] {
  return useMemo(() => {
    const base: Column<SignupRequest>[] = [
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
        key: "company",
        header: "Company",
        render: (row) => (
          <span className="text-text-secondary">{row.company}</span>
        ),
      },
      {
        key: "requestedPlan",
        header: "Plan",
        render: (row) => (
          <Badge variant={planVariant[row.requestedPlan]}>
            {row.requestedPlan}
          </Badge>
        ),
      },
      {
        key: "signedUpAt",
        header: "Signed up",
        sortable: true,
        render: (row) => (
          <span className="tabular-nums text-text-secondary">
            {row.signedUpAt}
          </span>
        ),
      },
    ];

    if (state === "pending") {
      base.push({
        key: "actions",
        header: "Actions",
        align: "right",
        render: (row) => (
          <div className="flex items-center justify-end gap-2">
            <ActionButton
              variant="approve"
              onClick={() =>
                toast.success(`Approved ${row.name}`, {
                  description: `${row.company} · ${row.requestedPlan} plan`,
                })
              }
            />
            <ActionButton
              variant="reject"
              onClick={() =>
                toast.error(`Rejected ${row.name}`, {
                  description: row.email,
                })
              }
            />
          </div>
        ),
      });
    }

    return base;
  }, [state]);
}

export function SignupsQueue() {
  const { data, isLoading, isError, error, refetch } = useSignupRequests();
  const [state, setState] = useState<SignupState>("pending");
  const columns = useColumns(state);

  const all = data ?? [];
  const rows = all.filter((s) => s.state === state);

  const counts = useMemo(
    () => ({
      pending: all.filter((s) => s.state === "pending").length,
      approved: all.filter((s) => s.state === "approved").length,
      rejected: all.filter((s) => s.state === "rejected").length,
    }),
    [all]
  );

  const emptyState = isLoading
    ? "Loading signups…"
    : isError
      ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-danger-text">
            {error?.message ?? "Failed to load signups"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
      : "No signups in this queue";

  return (
    <Tabs.Root
      value={state}
      onValueChange={(v) => setState(v as SignupState)}
      className="flex flex-col gap-4"
    >
      <Tabs.List>
        <Tabs.Trigger value="pending">
          Pending
          {isLoading ? (
            <span className="text-xs text-text-tertiary">(—)</span>
          ) : (
            <Badge variant="danger" className="text-[10px]">
              {counts.pending}
            </Badge>
          )}
        </Tabs.Trigger>
        <Tabs.Trigger value="approved">
          Approved{" "}
          <span className="text-xs text-text-tertiary">
            ({isLoading ? "—" : counts.approved})
          </span>
        </Tabs.Trigger>
        <Tabs.Trigger value="rejected">
          Rejected{" "}
          <span className="text-xs text-text-tertiary">
            ({isLoading ? "—" : counts.rejected})
          </span>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value={state} forceMount>
        <DataTable<SignupRequest>
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          pagination={{
            page: 1,
            pageSize: rows.length || 1,
            total: rows.length,
          }}
          emptyState={emptyState}
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}

interface ActionButtonProps {
  variant: "approve" | "reject";
  onClick: () => void;
}

function ActionButton({ variant, onClick }: ActionButtonProps) {
  const isApprove = variant === "approve";
  const Icon = isApprove ? Check : X;
  const label = isApprove ? "Approve" : "Reject";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        inline-flex h-7 w-7 items-center justify-center rounded-md
        border transition-colors
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-border-focus
        ${
          isApprove
            ? "border-success-subtle bg-success-subtle text-success-text hover:bg-success hover:text-on-primary hover:border-success"
            : "border-danger-subtle bg-danger-subtle text-danger-text hover:bg-danger hover:text-on-danger hover:border-danger"
        }
      `}
    >
      <Icon size={14} />
    </button>
  );
}
