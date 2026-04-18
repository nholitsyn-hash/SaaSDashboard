/**
 * Mock cohort retention data — 12 monthly cohorts × up to 6 months tracked.
 *
 * Anchored to "today = 2026-04-18":
 *   - May 2025 through Oct 2025: tracked 6+ months — all values present
 *   - Nov 2025: 5 months → last cell (M5) is null
 *   - newer cohorts progressively have fewer months of data (triangular gap)
 *
 * Narrative baked into the mock: retention trend is gently improving over
 * time (newer cohorts retain better) — a "product is getting stickier"
 * story. Common in a growing SaaS and reads well in demos.
 */

export interface CohortRow {
  cohort: string;
  /** Retention % at month 0..5 after signup; null when the cohort is too new. */
  retention: Array<number | null>;
}

export const mockCohorts: CohortRow[] = [
  { cohort: "May '25", retention: [100, 76, 62, 54, 48, 44] },
  { cohort: "Jun '25", retention: [100, 77, 63, 55, 49, 45] },
  { cohort: "Jul '25", retention: [100, 78, 64, 56, 50, 46] },
  { cohort: "Aug '25", retention: [100, 79, 66, 58, 52, 48] },
  { cohort: "Sep '25", retention: [100, 81, 68, 60, 54, 50] },
  { cohort: "Oct '25", retention: [100, 83, 70, 62, 56, 52] },
  { cohort: "Nov '25", retention: [100, 85, 72, 64, 58, null] },
  { cohort: "Dec '25", retention: [100, 86, 74, 66, 60, null] },
  { cohort: "Jan '26", retention: [100, 87, 75, 68, null, null] },
  { cohort: "Feb '26", retention: [100, 88, 77, null, null, null] },
  { cohort: "Mar '26", retention: [100, 89, null, null, null, null] },
  { cohort: "Apr '26", retention: [100, null, null, null, null, null] },
];

export const COHORT_MONTH_LABELS = ["M0", "M1", "M2", "M3", "M4", "M5"];
