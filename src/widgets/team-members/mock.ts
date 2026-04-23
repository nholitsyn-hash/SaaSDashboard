import type { Role } from "@/shared/types/auth";

/**
 * Mock team members + pending invitations.
 */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
  initials: string;
}

export const mockTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Nikita Golitsyn", email: "nikita@acme.co", role: "super_admin", lastActive: "Active now", initials: "NG" },
  { id: "tm-2", name: "Sarah Whitfield", email: "sarah@acme.co", role: "admin", lastActive: "12 min ago", initials: "SW" },
  { id: "tm-3", name: "David Chen", email: "david@acme.co", role: "admin", lastActive: "1 hour ago", initials: "DC" },
  { id: "tm-4", name: "Emily Roberts", email: "emily@acme.co", role: "admin", lastActive: "Yesterday", initials: "ER" },
  { id: "tm-5", name: "Michael Hayes", email: "michael@acme.co", role: "viewer", lastActive: "2 days ago", initials: "MH" },
  { id: "tm-6", name: "Jessica Palmer", email: "jessica@acme.co", role: "viewer", lastActive: "1 week ago", initials: "JP" },
  { id: "tm-7", name: "Ryan Sullivan", email: "ryan@acme.co", role: "viewer", lastActive: "3 weeks ago", initials: "RS" },
];

export interface PendingInvite {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  sentAt: string;
}

export const mockPendingInvites: PendingInvite[] = [
  { id: "pi-1", email: "kevin@acme.co", role: "admin", invitedBy: "Nikita Golitsyn", sentAt: "2 hours ago" },
  { id: "pi-2", email: "laura@acme.co", role: "viewer", invitedBy: "Sarah Whitfield", sentAt: "yesterday" },
  { id: "pi-3", email: "marcus@acme.co", role: "viewer", invitedBy: "Nikita Golitsyn", sentAt: "3 days ago" },
];

export const teamCounts = {
  members: mockTeamMembers.length,
  invites: mockPendingInvites.length,
  admins: mockTeamMembers.filter(
    (m) => m.role === "admin" || m.role === "super_admin"
  ).length,
};
