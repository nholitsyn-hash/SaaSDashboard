/**
 * Mock MRR series — last 30 days, USD, slight upward trend.
 * Pass 2 will replace this file with a TanStack Query hook hitting the API.
 */

export interface MrrPoint {
  date: string; // ISO yyyy-mm-dd
  value: number; // USD
}

export const mockMrrSeries: MrrPoint[] = [
  { date: "2026-03-20", value: 42800 },
  { date: "2026-03-21", value: 43120 },
  { date: "2026-03-22", value: 42950 },
  { date: "2026-03-23", value: 43400 },
  { date: "2026-03-24", value: 43780 },
  { date: "2026-03-25", value: 44100 },
  { date: "2026-03-26", value: 44050 },
  { date: "2026-03-27", value: 44380 },
  { date: "2026-03-28", value: 44720 },
  { date: "2026-03-29", value: 44900 },
  { date: "2026-03-30", value: 45210 },
  { date: "2026-03-31", value: 45480 },
  { date: "2026-04-01", value: 45750 },
  { date: "2026-04-02", value: 45600 },
  { date: "2026-04-03", value: 45980 },
  { date: "2026-04-04", value: 46320 },
  { date: "2026-04-05", value: 46510 },
  { date: "2026-04-06", value: 46480 },
  { date: "2026-04-07", value: 46820 },
  { date: "2026-04-08", value: 47100 },
  { date: "2026-04-09", value: 47350 },
  { date: "2026-04-10", value: 47280 },
  { date: "2026-04-11", value: 47620 },
  { date: "2026-04-12", value: 47890 },
  { date: "2026-04-13", value: 48020 },
  { date: "2026-04-14", value: 47960 },
  { date: "2026-04-15", value: 48180 },
  { date: "2026-04-16", value: 48340 },
  { date: "2026-04-17", value: 48420 },
  { date: "2026-04-18", value: 48250 },
];
