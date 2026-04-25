"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  DashboardOverviewResponseSchema,
  type DashboardOverviewResponse,
} from "./model";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
};

async function fetchDashboard(): Promise<DashboardOverviewResponse> {
  const res = await fetch("/api/dashboard", {
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
  return DashboardOverviewResponseSchema.parse(json);
}

export function useDashboard(): UseQueryResult<
  DashboardOverviewResponse,
  Error
> {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: fetchDashboard,
  });
}
