import { Shield } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function AdminTeamPage() {
  return (
    <PagePlaceholder
      title="Team & Permissions"
      description="Invite teammates, assign roles, and manage workspace-wide access."
      icon={Shield}
    />
  );
}
