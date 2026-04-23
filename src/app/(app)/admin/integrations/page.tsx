import { Typography } from "@/shared/ui";
import { IntegrationsGrid } from "@/widgets/integrations-grid";
import { integrationCounts } from "@/widgets/integrations-grid/mock";

export default function AdminIntegrationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <Typography variant="h2">Integrations</Typography>
            <Typography variant="body-sm">
              Connect Stripe, Paddle, HubSpot, Slack and other data sources
            </Typography>
          </div>
          <div className="text-sm text-text-tertiary">
            <span className="font-semibold text-text-primary tabular-nums">
              {integrationCounts.connected}
            </span>{" "}
            of{" "}
            <span className="tabular-nums">{integrationCounts.total}</span>{" "}
            connected
          </div>
        </header>

        <IntegrationsGrid />
      </div>
    </div>
  );
}
