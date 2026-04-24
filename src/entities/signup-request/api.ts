"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  SignupRequestsListResponseSchema,
  type SignupRequest,
} from "./model";

export const signupRequestKeys = {
  all: ["signup-requests"] as const,
  lists: () => [...signupRequestKeys.all, "list"] as const,
};

async function fetchSignupRequests(): Promise<SignupRequest[]> {
  const res = await fetch("/api/signups", {
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
  return SignupRequestsListResponseSchema.parse(json).signupRequests;
}

export function useSignupRequests(): UseQueryResult<SignupRequest[], Error> {
  return useQuery({
    queryKey: signupRequestKeys.lists(),
    queryFn: fetchSignupRequests,
  });
}
