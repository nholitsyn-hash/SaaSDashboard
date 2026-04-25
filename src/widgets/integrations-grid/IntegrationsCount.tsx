"use client";

import { useIntegrations } from "@/entities/integration";

/**
 * IntegrationsCount — "X of Y connected" pill for the page header.
 * Tiny client island; the page itself stays an RSC.
 */
export function IntegrationsCount() {
  const { data, isLoading } = useIntegrations();

  if (isLoading || !data) {
    return <span className="text-sm text-text-tertiary">Loading…</span>;
  }

  const total = data.length;
  const connected = data.filter((i) => i.status === "connected").length;

  return (
    <div className="text-sm text-text-tertiary">
      <span className="font-semibold text-text-primary tabular-nums">
        {connected}
      </span>{" "}
      of <span className="tabular-nums">{total}</span> connected
    </div>
  );
}
