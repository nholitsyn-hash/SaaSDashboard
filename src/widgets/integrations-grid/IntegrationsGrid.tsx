"use client";

import { CheckCircle2, Plug } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button } from "@/shared/ui";
import { formatRelativeTime } from "@/shared/utils/relative-time";
import {
  useIntegrations,
  type Integration,
} from "@/entities/integration";

/**
 * IntegrationsGrid — catalog of connectable services.
 *
 * WHY brand palette is keyed by `slug` and lives in this widget:
 *   Logo / brand color is presentation, not data. The DB stores the slug
 *   (stable identifier); this map paints it. When real SVGs land, swap
 *   the colored tile for an `<img src={logoUrl}>` keyed off the same slug.
 *
 * WHY a fallback for unknown slugs:
 *   If the seed adds a new slug before the palette catches up, the card
 *   still renders something coherent (first letter on a neutral square)
 *   instead of a runtime crash. Prevents "data outpaced UI" breakage.
 */

const palette: Record<string, { initials: string; color: string }> = {
  stripe: { initials: "S", color: "#635bff" },
  paddle: { initials: "P", color: "#3b82f6" },
  hubspot: { initials: "H", color: "#ff7a59" },
  slack: { initials: "SL", color: "#4a154b" },
  zapier: { initials: "Z", color: "#ff4a00" },
  segment: { initials: "SG", color: "#52bd94" },
  intercom: { initials: "I", color: "#1f8ded" },
  ga: { initials: "GA", color: "#e37400" },
};

const fallbackBrand = (name: string) => ({
  initials: name[0]?.toUpperCase() ?? "?",
  color: "#64748b",
});

export function IntegrationsGrid() {
  const { data, isLoading, isError, error, refetch } = useIntegrations();

  if (isLoading) {
    return (
      <p className="text-sm text-text-tertiary">Loading integrations…</p>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-danger-subtle bg-danger-subtle/40 p-6">
        <p className="text-sm text-danger-text">
          {error?.message ?? "Failed to load integrations"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }
  const integrations = data ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const isConnected = integration.status === "connected";
  const brand = palette[integration.slug] ?? fallbackBrand(integration.name);

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
          style={{ backgroundColor: brand.color }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
        >
          {brand.initials}
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
            ? `Connected · ${formatRelativeTime(integration.connectedAt)}`
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
