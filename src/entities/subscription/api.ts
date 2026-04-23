"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  SubscriptionsListResponseSchema,
  type Subscription,
} from "./model";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
};

async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions", {
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
  return SubscriptionsListResponseSchema.parse(json).subscriptions;
}

export function useSubscriptions(): UseQueryResult<Subscription[], Error> {
  return useQuery({
    queryKey: subscriptionKeys.lists(),
    queryFn: fetchSubscriptions,
  });
}
