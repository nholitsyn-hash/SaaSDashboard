/**
 * Mock daily active users — last 30 days.
 * Weekend dips baked in (lower Sat/Sun) for realistic visual texture.
 */

export interface ActiveUsersPoint {
  date: string;
  count: number;
}

export const mockActiveUsers: ActiveUsersPoint[] = [
  { date: "2026-03-20", count: 1840 },
  { date: "2026-03-21", count: 1520 },
  { date: "2026-03-22", count: 1490 },
  { date: "2026-03-23", count: 1920 },
  { date: "2026-03-24", count: 2040 },
  { date: "2026-03-25", count: 2110 },
  { date: "2026-03-26", count: 2080 },
  { date: "2026-03-27", count: 1950 },
  { date: "2026-03-28", count: 1610 },
  { date: "2026-03-29", count: 1570 },
  { date: "2026-03-30", count: 2020 },
  { date: "2026-03-31", count: 2140 },
  { date: "2026-04-01", count: 2180 },
  { date: "2026-04-02", count: 2150 },
  { date: "2026-04-03", count: 2030 },
  { date: "2026-04-04", count: 1690 },
  { date: "2026-04-05", count: 1640 },
  { date: "2026-04-06", count: 2080 },
  { date: "2026-04-07", count: 2200 },
  { date: "2026-04-08", count: 2240 },
  { date: "2026-04-09", count: 2210 },
  { date: "2026-04-10", count: 2100 },
  { date: "2026-04-11", count: 1740 },
  { date: "2026-04-12", count: 1680 },
  { date: "2026-04-13", count: 2130 },
  { date: "2026-04-14", count: 2250 },
  { date: "2026-04-15", count: 2290 },
  { date: "2026-04-16", count: 2260 },
  { date: "2026-04-17", count: 2184 },
  { date: "2026-04-18", count: 2184 },
];
