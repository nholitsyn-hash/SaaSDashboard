"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  IntegrationsListResponseSchema,
  type Integration,
} from "./model";

export const integrationKeys = {
  all: ["integrations"] as const,
  lists: () => [...integrationKeys.all, "list"] as const,
};

async function fetchIntegrations(): Promise<Integration[]> {
  const res = await fetch("/api/integrations", {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* not JSON */
    }
    throw new Error(message);
  }
  const json: unknown = await res.json();
  return IntegrationsListResponseSchema.parse(json).integrations;
}

export function useIntegrations(): UseQueryResult<Integration[], Error> {
  return useQuery({
    queryKey: integrationKeys.lists(),
    queryFn: fetchIntegrations,
  });
}
