/**
 * Mock conversion funnel — user counts at each stage of the trial-to-paid flow.
 * Each stage is a strict subset of the previous.
 */

export interface FunnelStage {
  stage: string;
  count: number;
}

export const mockConversionFunnel: FunnelStage[] = [
  { stage: "Visitors", count: 18400 },
  { stage: "Signups", count: 3240 },
  { stage: "Activated", count: 1820 },
  { stage: "Paid", count: 900 },
];
