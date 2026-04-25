import { z } from "zod";

/**
 * Integration — wire format.
 *
 * WHY ISO `connectedAt` (not pre-formatted "2 months ago"):
 *   Same reasoning as TeamMember.lastActiveAt — relative labels move,
 *   server timestamps don't. Client formats with `formatRelativeTime`.
 *
 * WHY brand visuals (initials, color) live in the WIDGET, not the schema:
 *   Logo / brand color is presentation, not data. Storing them in the DB
 *   would mean every org has identical rows for these fields. The widget
 *   keeps a static palette by `slug`; when real SVG logos are added,
 *   the palette becomes a `<img>` swap — schema doesn't need to change.
 */

export const IntegrationStatusSchema = z.enum(["connected", "available"]);
export type IntegrationStatus = z.infer<typeof IntegrationStatusSchema>;

export const IntegrationCategorySchema = z.enum([
  "Payments",
  "CRM",
  "Communication",
  "Analytics",
  "Automation",
]);
export type IntegrationCategory = z.infer<typeof IntegrationCategorySchema>;

export const IntegrationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: IntegrationCategorySchema,
  description: z.string(),
  status: IntegrationStatusSchema,
  connectedAt: z.string().nullable(),
});
export type Integration = z.infer<typeof IntegrationSchema>;

export const IntegrationsListResponseSchema = z.object({
  integrations: z.array(IntegrationSchema),
});
export type IntegrationsListResponse = z.infer<
  typeof IntegrationsListResponseSchema
>;
