import { Plug } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function AdminIntegrationsPage() {
  return (
    <PagePlaceholder
      title="Integrations"
      description="Connect Stripe, Paddle, HubSpot, Slack, and other data sources."
      icon={Plug}
    />
  );
}
