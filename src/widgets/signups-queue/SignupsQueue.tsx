"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Badge, DataTable, Tabs, type Column } from "@/shared/ui";
import {
  mockSignupRequests,
  signupCounts,
  type SignupPlan,
  type SignupRequest,
  type SignupState,
} from "./mock";

/**
 * SignupsQueue — pending-first queue with inline approve/reject actions.
 *
 * WHY inline row actions instead of a bulk-select + top toolbar:
 * Reviewing signups is a per-row judgment ("does this email look real?",
 * "does the company match the plan?"). Per-row Approve/Reject buttons
 * match that mental model better than "check 5 boxes → bulk approve".
 * Bulk actions can layer on top later without disturbing this flow.
 *
 * Pass 1 fires toasts only — no row removal, no state change. Pass 2
 * wires handlers to TanStack mutations and optimistically removes rows.
 */

const planVariant: Record<SignupPlan, "default" | "primary" | "secondary"> = {
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
  const [state, setState] = useState<SignupState>("pending");
  const columns = useColumns(state);

  const rows = mockSignupRequests.filter((s) => s.state === state);

  return (
    <Tabs.Root
      value={state}
      onValueChange={(v) => setState(v as SignupState)}
      className="flex flex-col gap-4"
    >
      <Tabs.List>
        <Tabs.Trigger value="pending">
          Pending
          <Badge variant="danger" className="text-[10px]">
            {signupCounts.pending}
          </Badge>
        </Tabs.Trigger>
        <Tabs.Trigger value="approved">
          Approved
          <span className="text-xs text-text-tertiary">
            ({signupCounts.approved})
          </span>
        </Tabs.Trigger>
        <Tabs.Trigger value="rejected">
          Rejected
          <span className="text-xs text-text-tertiary">
            ({signupCounts.rejected})
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
          emptyState="No signups in this queue"
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
