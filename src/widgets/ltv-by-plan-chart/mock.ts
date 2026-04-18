/**
 * LTV by plan — average lifetime value per subscriber in each tier.
 *
 * Free is included (LTV > 0 because a % of free users convert to paid);
 * numbers reflect typical B2B SaaS curves where LTV scales roughly
 * 50× from Free → Pro and another 7× from Pro → Enterprise.
 */

export interface PlanLtv {
  plan: "Free" | "Pro" | "Enterprise";
  value: number;
}

export const mockPlanLtv: PlanLtv[] = [
  { plan: "Free", value: 22 },
  { plan: "Pro", value: 1240 },
  { plan: "Enterprise", value: 8750 },
];
