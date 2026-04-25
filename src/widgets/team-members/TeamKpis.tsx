"use client";

import { KpiCard } from "@/shared/ui";
import { useTeamInvites, useTeamMembers } from "@/entities/team";

/**
 * TeamKpis — counts derived from the same hooks the list uses.
 * TanStack dedup means this row + the list = one fetch each.
 */
export function TeamKpis() {
  const { data: members, isLoading: loadingMembers } = useTeamMembers();
  const { data: invites, isLoading: loadingInvites } = useTeamInvites();

  const total = members?.length ?? 0;
  const admins =
    members?.filter((m) => m.role === "admin" || m.role === "super_admin")
      .length ?? 0;
  const pending = invites?.length ?? 0;

  const display = (n: number, loading: boolean) => (loading ? "—" : n);

  return (
    <section
      aria-label="Team KPIs"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      <KpiCard label="Members" value={display(total, loadingMembers)} />
      <KpiCard label="Admins" value={display(admins, loadingMembers)} />
      <KpiCard label="Pending invites" value={display(pending, loadingInvites)} />
    </section>
  );
}
