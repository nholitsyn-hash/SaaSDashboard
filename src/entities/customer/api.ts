"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  CustomersListResponseSchema,
  type Customer,
} from "./model";

/**
 * Customer data-fetching layer — fetcher + query keys + hook.
 *
 * WHY keys as a hierarchical factory (not string literals):
 * Every TanStack cache entry is identified by its queryKey. When a
 * mutation happens (e.g. "customer updated") we invalidate all related
 * queries at once:
 *
 *   queryClient.invalidateQueries({ queryKey: customerKeys.all });
 *
 * The factory makes the hierarchy explicit and rename-safe — grep for
 * `customerKeys.lists()` catches everyone; `queryKey: ["customers", "list"]`
 * sprinkled as string literals would not.
 *
 * WHY Zod-parse the response on the client:
 * The server already validates before sending — but the client reads
 * across the network and an old SW, a stale deploy, or a schema drift
 * can deliver shapes the UI doesn't expect. Parse here and the widget
 * either gets well-typed data or a clear error state; no `any` leakage.
 *
 * WHY throw on !ok:
 * TanStack Query promotes a thrown error to the `error` state of the
 * hook. UI can then render a retry button via `refetch()`. Returning a
 * tagged result instead would force every caller to discriminate — more
 * code for worse DX.
 */

export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  // Ready for later:
  //   detail: (id: string) => [...customerKeys.all, "detail", id] as const,
};

async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch("/api/customers", {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    // Pull a helpful message if the server supplied one; else a generic.
    let message = `Request failed with ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* not JSON, keep generic */
    }
    throw new Error(message);
  }

  const json: unknown = await res.json();
  const parsed = CustomersListResponseSchema.parse(json);
  return parsed.customers;
}

export function useCustomers(): UseQueryResult<Customer[], Error> {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: fetchCustomers,
  });
}
