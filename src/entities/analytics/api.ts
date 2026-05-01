"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  AnalyticsResponseSchema,
  type AnalyticsResponse,
} from "./model";

export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: () => [...analyticsKeys.all, "overview"] as const,
};

async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics", {
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
  return AnalyticsResponseSchema.parse(json);
}

export function useAnalytics(): UseQueryResult<AnalyticsResponse, Error> {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: fetchAnalytics,
  });
}
