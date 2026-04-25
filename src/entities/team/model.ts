import { z } from "zod";

/**
 * Team member + invitation wire formats.
 *
 * WHY one entity for two endpoints (members + invites):
 *   The Team page consumes both as one logical unit. Co-locating their
 *   schemas keeps the page's data contract in one file. If they ever
 *   diverge into independent surfaces, split into two folders.
 *
 * WHY return ISO `lastActiveAt` (not pre-formatted "2 hours ago"):
 *   "2 hours ago" depends on `now`, which moves. Caching the formatted
 *   string would freeze the label. Returning ISO + formatting on the
 *   client means every render computes the latest relative label —
 *   matches what `Intl.RelativeTimeFormat` and date-fns do.
 */

export const TeamRoleSchema = z.enum(["super_admin", "admin", "viewer"]);
export type TeamRole = z.infer<typeof TeamRoleSchema>;

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: TeamRoleSchema,
  /** ISO datetime, may be null for never-logged-in users. */
  lastActiveAt: z.string().nullable(),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamMembersListResponseSchema = z.object({
  members: z.array(TeamMemberSchema),
});
export type TeamMembersListResponse = z.infer<
  typeof TeamMembersListResponseSchema
>;

export const InviteStatusSchema = z.enum([
  "pending",
  "accepted",
  "revoked",
  "expired",
]);
export type InviteStatus = z.infer<typeof InviteStatusSchema>;

export const TeamInviteSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: TeamRoleSchema,
  status: InviteStatusSchema,
  invitedBy: z.string(),
  /** ISO datetime when invite was sent. */
  sentAt: z.string(),
  /** ISO datetime, when this invitation expires. */
  expiresAt: z.string(),
});
export type TeamInvite = z.infer<typeof TeamInviteSchema>;

export const TeamInvitesListResponseSchema = z.object({
  invites: z.array(TeamInviteSchema),
});
export type TeamInvitesListResponse = z.infer<
  typeof TeamInvitesListResponseSchema
>;
