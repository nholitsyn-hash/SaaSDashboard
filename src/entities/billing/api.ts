"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  BillingOverviewResponseSchema,
  type BillingOverviewResponse,
} from "./model";

export const billingKeys = {
  all: ["billing"] as const,
  overview: () => [...billingKeys.all, "overview"] as const,
};

async function fetchBillingOverview(): Promise<BillingOverviewResponse> {
  const res = await fetch("/api/billing/overview", {
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
  return BillingOverviewResponseSchema.parse(json);
}

export function useBillingOverview(): UseQueryResult<
  BillingOverviewResponse,
  Error
> {
  return useQuery({
    queryKey: billingKeys.overview(),
    queryFn: fetchBillingOverview,
  });
}
