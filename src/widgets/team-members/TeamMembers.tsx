"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, DataTable, Tabs, type Column } from "@/shared/ui";
import { initialsFrom } from "@/shared/utils/initials";
import { formatRelativeTime } from "@/shared/utils/relative-time";
import {
  useTeamInvites,
  useTeamMembers,
  type TeamInvite,
  type TeamMember,
  type TeamRole,
} from "@/entities/team";

/**
 * TeamMembers — tabbed list of active members + pending invites.
 * Both tabs are independent queries; TanStack dedupes per key.
 */

const roleVariant: Record<TeamRole, "default" | "primary" | "secondary"> = {
  viewer: "default",
  admin: "primary",
  super_admin: "secondary",
};

const roleLabel: Record<TeamRole, string> = {
  viewer: "Viewer",
  admin: "Admin",
  super_admin: "Super admin",
};

type TabKey = "members" | "invites";

export function TeamMembers() {
  const [tab, setTab] = useState<TabKey>("members");
  const membersQuery = useTeamMembers();
  const invitesQuery = useTeamInvites();

  const memberCount = membersQuery.data?.length;
  const inviteCount = invitesQuery.data?.length;

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(v) => setTab(v as TabKey)}
      className="flex flex-col gap-4"
    >
      <Tabs.List>
        <Tabs.Trigger value="members">
          Members{" "}
          <span className="text-xs text-text-tertiary">
            ({memberCount ?? "—"})
          </span>
        </Tabs.Trigger>
        <Tabs.Trigger value="invites">
          Pending invites{" "}
          <span className="text-xs text-text-tertiary">
            ({inviteCount ?? "—"})
          </span>
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="members">
        <DataTable<TeamMember>
          columns={memberColumns}
          rows={membersQuery.data ?? []}
          getRowKey={(row) => row.id}
          pagination={{
            page: 1,
            pageSize: (membersQuery.data?.length || 1),
            total: membersQuery.data?.length ?? 0,
          }}
          emptyState={
            membersQuery.isLoading
              ? "Loading members…"
              : membersQuery.isError
                ? (
                  <ErrorRetry
                    message={membersQuery.error?.message}
                    onRetry={() => membersQuery.refetch()}
                  />
                )
                : "No members in this workspace"
          }
        />
      </Tabs.Content>

      <Tabs.Content value="invites">
        <DataTable<TeamInvite>
          columns={inviteColumns}
          rows={invitesQuery.data ?? []}
          getRowKey={(row) => row.id}
          pagination={{
            page: 1,
            pageSize: (invitesQuery.data?.length || 1),
            total: invitesQuery.data?.length ?? 0,
          }}
          emptyState={
            invitesQuery.isLoading
              ? "Loading invitations…"
              : invitesQuery.isError
                ? (
                  <ErrorRetry
                    message={invitesQuery.error?.message}
                    onRetry={() => invitesQuery.refetch()}
                  />
                )
                : "No pending invitations"
          }
        />
      </Tabs.Content>
    </Tabs.Root>
  );
}

function ErrorRetry({
  message,
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <p className="text-sm text-danger-text">
        {message ?? "Failed to load"}
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

const memberColumns: Column<TeamMember>[] = [
  {
    key: "member",
    header: "Member",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white"
        >
          {initialsFrom(row.name, row.email)}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">{row.name}</span>
          <span className="text-xs text-text-tertiary">{row.email}</span>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <Badge variant={roleVariant[row.role]}>{roleLabel[row.role]}</Badge>
    ),
  },
  {
    key: "lastActive",
    header: "Last active",
    sortable: true,
    render: (row) => (
      <span className="text-text-secondary">
        {formatRelativeTime(row.lastActiveAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    align: "right",
    render: (row) => <MemberActions member={row} />,
  },
];

const inviteColumns: Column<TeamInvite>[] = [
  {
    key: "email",
    header: "Email",
    render: (row) => (
      <span className="font-medium text-text-primary">{row.email}</span>
    ),
  },
  {
    key: "role",
    header: "Invited as",
    render: (row) => (
      <Badge variant={roleVariant[row.role]}>{roleLabel[row.role]}</Badge>
    ),
  },
  {
    key: "invitedBy",
    header: "Invited by",
    render: (row) => (
      <span className="text-text-secondary">{row.invitedBy}</span>
    ),
  },
  {
    key: "sentAt",
    header: "Sent",
    render: (row) => (
      <span className="text-text-secondary">
        {formatRelativeTime(row.sentAt)}
      </span>
    ),
  },
  {
    key: "actions",
    header: "",
    align: "right",
    render: (row) => <InviteActions invite={row} />,
  },
];

function MemberActions({ member }: { member: TeamMember }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${member.name}`}
          className="
            inline-flex h-7 w-7 items-center justify-center rounded-md
            text-text-tertiary transition-colors
            hover:bg-bg-muted hover:text-text-primary
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus
          "
        >
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[180px] rounded-xl border border-border-default bg-bg-surface-raised p-1 shadow-lg"
        >
          <DropdownItem
            icon={UserCog}
            onSelect={() =>
              toast.info("Change role", {
                description: `Real flow opens a role picker for ${member.name}`,
              })
            }
          >
            Change role
          </DropdownItem>
          <DropdownItem
            icon={ShieldCheck}
            onSelect={() =>
              toast.info("Reset 2FA", { description: member.email })
            }
          >
            Reset 2FA
          </DropdownItem>
          <div className="my-1 h-px bg-border-subtle" />
          <DropdownItem
            icon={Trash2}
            destructive
            onSelect={() =>
              toast.error(`Remove ${member.name}?`, {
                description: "This action requires confirmation in production",
              })
            }
          >
            Remove member
          </DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function InviteActions({ invite }: { invite: TeamInvite }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() =>
          toast.success("Invite resent", { description: invite.email })
        }
        className="
          rounded-md border border-border-default bg-bg-surface
          px-2 py-1 text-xs font-medium text-text-secondary
          transition-colors hover:bg-bg-muted hover:text-text-primary
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-border-focus
        "
      >
        Resend
      </button>
      <button
        type="button"
        onClick={() =>
          toast.error("Invite revoked", { description: invite.email })
        }
        className="
          rounded-md border border-danger-subtle bg-danger-subtle
          px-2 py-1 text-xs font-medium text-danger-text
          transition-colors hover:bg-danger hover:text-on-danger hover:border-danger
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-border-focus
        "
      >
        Revoke
      </button>
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  icon: typeof UserCog;
  onSelect: () => void;
  destructive?: boolean;
}

function DropdownItem({
  children,
  icon: Icon,
  onSelect,
  destructive,
}: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={`
        flex items-center gap-2 rounded-md px-3 py-2
        text-sm cursor-pointer outline-none
        ${
          destructive
            ? "text-danger-text data-[highlighted]:bg-danger-subtle"
            : "text-text-secondary data-[highlighted]:bg-bg-muted data-[highlighted]:text-text-primary"
        }
      `}
    >
      <Icon size={14} />
      {children}
    </DropdownMenu.Item>
  );
}
