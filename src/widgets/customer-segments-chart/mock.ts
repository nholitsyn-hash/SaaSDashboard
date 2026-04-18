/**
 * Customer segments — share of customer base by company size.
 * Percentages; sum to ~100.
 */

export interface CustomerSegment {
  segment: "SMB" | "Mid-Market" | "Enterprise";
  share: number;
}

export const mockCustomerSegments: CustomerSegment[] = [
  { segment: "SMB", share: 62 },
  { segment: "Mid-Market", share: 28 },
  { segment: "Enterprise", share: 10 },
];
