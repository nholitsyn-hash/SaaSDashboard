/**
 * Mock integrations catalog.
 * Color hexes approximate each brand so cards feel grounded, even without
 * real logos. Swap `initials` for `<img>` when we have proper SVGs.
 */

export type IntegrationStatus = "connected" | "available";
export type IntegrationCategory =
  | "Payments"
  | "CRM"
  | "Communication"
  | "Analytics"
  | "Automation";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  initials: string;
  color: string; // hex for the logo block
  status: IntegrationStatus;
  connectedAt?: string;
}

export const mockIntegrations: Integration[] = [
  { id: "stripe", name: "Stripe", category: "Payments", description: "Process payments and manage subscriptions.", initials: "S", color: "#635bff", status: "connected", connectedAt: "2 months ago" },
  { id: "paddle", name: "Paddle", category: "Payments", description: "Merchant of Record payments with tax handling.", initials: "P", color: "#3b82f6", status: "available" },
  { id: "hubspot", name: "HubSpot", category: "CRM", description: "Sync contacts, deals, and companies with your CRM.", initials: "H", color: "#ff7a59", status: "connected", connectedAt: "6 months ago" },
  { id: "slack", name: "Slack", category: "Communication", description: "Real-time alerts for signups, churn, and revenue events.", initials: "SL", color: "#4a154b", status: "connected", connectedAt: "3 weeks ago" },
  { id: "zapier", name: "Zapier", category: "Automation", description: "Connect to 5,000+ apps without writing code.", initials: "Z", color: "#ff4a00", status: "available" },
  { id: "segment", name: "Segment", category: "Analytics", description: "Pipe your customer events to every downstream tool.", initials: "SG", color: "#52bd94", status: "available" },
  { id: "intercom", name: "Intercom", category: "Communication", description: "Two-way sync of customers and conversation data.", initials: "I", color: "#1f8ded", status: "available" },
  { id: "ga", name: "Google Analytics", category: "Analytics", description: "Track acquisition, behavior, and conversion funnels.", initials: "GA", color: "#e37400", status: "connected", connectedAt: "4 months ago" },
];

export const integrationCounts = {
  total: mockIntegrations.length,
  connected: mockIntegrations.filter((i) => i.status === "connected").length,
};
