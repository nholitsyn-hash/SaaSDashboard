import { UserPlus } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function SignupsPage() {
  return (
    <PagePlaceholder
      title="Signups"
      description="Pending signups awaiting review, with bulk approve and invite flows."
      icon={UserPlus}
    />
  );
}
