/**
 * Mock revenue breakdown by plan — USD, current month.
 * Free plan excluded (no revenue). Pass 2 may add a "trials" cohort.
 */

export interface PlanRevenue {
  plan: "Pro" | "Enterprise" | "Add-ons";
  value: number;
}

export const mockPlanRevenue: PlanRevenue[] = [
  { plan: "Pro", value: 28400 },
  { plan: "Enterprise", value: 17250 },
  { plan: "Add-ons", value: 2600 },
];
