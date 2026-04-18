/**
 * Mock MRR movement data — 6 months, decomposed into:
 *   - New MRR       (positive, new subscriptions)
 *   - Expansion MRR (positive, upgrades/seat expansions)
 *   - Contraction   (negative, downgrades)
 *   - Churn         (negative, cancellations)
 *
 * Net change for a month = new + expansion + contraction + churn.
 */

export interface MrrMovementRow {
  month: string;
  new: number;
  expansion: number;
  contraction: number; // stored as negative
  churn: number; // stored as negative
}

export const mockMrrMovement: MrrMovementRow[] = [
  { month: "Nov '25", new: 4800, expansion: 1200, contraction: -400, churn: -1100 },
  { month: "Dec '25", new: 5200, expansion: 1400, contraction: -350, churn: -1050 },
  { month: "Jan '26", new: 4900, expansion: 1600, contraction: -420, churn: -980 },
  { month: "Feb '26", new: 5600, expansion: 1800, contraction: -380, churn: -1020 },
  { month: "Mar '26", new: 6100, expansion: 2100, contraction: -340, churn: -960 },
  { month: "Apr '26", new: 5800, expansion: 2400, contraction: -310, churn: -920 },
];
