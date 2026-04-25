"use client";

import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Typography } from "@/shared/ui";
import { TeamKpis, TeamMembers } from "@/widgets/team-members";

export default function AdminTeamPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <Typography variant="h2">Team & Permissions</Typography>
            <Typography variant="body-sm">
              Manage workspace members, roles, and pending invitations
            </Typography>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info("Invite flow", {
                description: "Real flow opens an email + role invite dialog",
              })
            }
            className="
              inline-flex items-center gap-2
              rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
              shadow-sm transition-colors hover:bg-primary-hover
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus focus-visible:ring-offset-2
            "
          >
            <UserPlus size={14} />
            Invite member
          </button>
        </header>

        <TeamKpis />
        <TeamMembers />
      </div>
    </div>
  );
}
