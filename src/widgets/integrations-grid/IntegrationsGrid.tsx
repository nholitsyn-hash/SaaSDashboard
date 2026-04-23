"use client";

import { CheckCircle2, Plug } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/shared/ui";
import { mockIntegrations, type Integration } from "./mock";

/**
 * IntegrationsGrid — catalog of connectable services.
 *
 * WHY the "logo" is a colored initial (not an <img>):
 * Placeholder until real SVGs land. Using hex per brand keeps each card
 * recognizable at a glance without bundling assets we don't have.
 *
 * WHY two states (Connected / Available), not a generic "Install":
 * Users scan for "what's already wired up" first, then "what can I add".
 * Connected cards show the connect timestamp for confidence; Available
 * cards expose a primary Connect CTA. Binary status matches real SaaS.
 */
export function IntegrationsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {mockIntegrations.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const isConnected = integration.status === "connected";

  const handleConnect = () => {
    if (isConnected) {
      toast.info(`${integration.name} — Manage`, {
        description: "Real flow opens the integration settings",
      });
    } else {
      toast.success(`Connected to ${integration.name}`, {
        description: "Real flow would complete OAuth + sync",
      });
    }
  };

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border-default bg-bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden
          style={{ backgroundColor: integration.color }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
        >
          {integration.initials}
        </div>
        {isConnected ? (
          <Badge variant="success" className="inline-flex items-center gap-1">
            <CheckCircle2 size={10} />
            Connected
          </Badge>
        ) : (
          <Badge variant="default">Available</Badge>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">
            {integration.name}
          </h3>
          <span className="text-[11px] text-text-tertiary">
            · {integration.category}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {integration.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 border-t border-border-subtle">
        <span className="text-[11px] text-text-tertiary">
          {isConnected && integration.connectedAt
            ? `Connected · ${integration.connectedAt}`
            : "Not connected"}
        </span>
        <button
          type="button"
          onClick={handleConnect}
          className={
            isConnected
              ? `
                inline-flex items-center gap-1.5
                rounded-md border border-border-default bg-bg-surface
                px-2.5 py-1 text-xs font-medium text-text-secondary
                transition-colors hover:bg-bg-muted hover:text-text-primary
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
              `
              : `
                inline-flex items-center gap-1.5
                rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-white
                transition-colors hover:bg-primary-hover
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2
              `
          }
        >
          <Plug size={12} />
          {isConnected ? "Manage" : "Connect"}
        </button>
      </div>
    </article>
  );
}
