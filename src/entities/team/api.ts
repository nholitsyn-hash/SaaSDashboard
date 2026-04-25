"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  TeamMembersListResponseSchema,
  TeamInvitesListResponseSchema,
  type TeamMember,
  type TeamInvite,
} from "./model";

export const teamKeys = {
  all: ["team"] as const,
  members: () => [...teamKeys.all, "members"] as const,
  invites: () => [...teamKeys.all, "invites"] as const,
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
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
  return res.json() as Promise<T>;
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
  const json = await fetchJson<unknown>("/api/team/members");
  return TeamMembersListResponseSchema.parse(json).members;
}

async function fetchTeamInvites(): Promise<TeamInvite[]> {
  const json = await fetchJson<unknown>("/api/team/invites");
  return TeamInvitesListResponseSchema.parse(json).invites;
}

export function useTeamMembers(): UseQueryResult<TeamMember[], Error> {
  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: fetchTeamMembers,
  });
}

export function useTeamInvites(): UseQueryResult<TeamInvite[], Error> {
  return useQuery({
    queryKey: teamKeys.invites(),
    queryFn: fetchTeamInvites,
  });
}
