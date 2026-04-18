/**
 * Mock revenue by region — USD, current month. Western-market weighted.
 */

export interface RegionRevenue {
  region: string;
  value: number;
}

export const mockRegionRevenue: RegionRevenue[] = [
  { region: "North America", value: 22400 },
  { region: "Europe", value: 13800 },
  { region: "United Kingdom", value: 6900 },
  { region: "APAC", value: 3450 },
  { region: "LATAM", value: 1700 },
];
