import type { LucideIcon } from "lucide-react";
import {
  Crown,
  Globe,
  Layers,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

/**
 * Report templates — canned reports a user can run on demand.
 *
 * WHY `slug` (not numeric id):
 * Slugs are URL-safe, human-readable, and survive reorderings. The detail
 * route `/reports/[slug]` reads the slug and looks up the template —
 * stable bookmarks forever.
 *
 * In pass 2 this data will move server-side (Prisma model) and the mock
 * becomes a seed. The shape stays the same.
 */

export type ReportSlug =
  | "mrr-breakdown"
  | "churn-cohort"
  | "ltv-by-plan"
  | "revenue-by-region"
  | "top-customers"
  | "subscription-changes";

export interface ReportTemplate {
  slug: ReportSlug;
  title: string;
  description: string;
  icon: LucideIcon;
  lastRun: string;
  rowCount: number;
}

export const reportTemplates: ReportTemplate[] = [
  {
    slug: "mrr-breakdown",
    title: "MRR Breakdown",
    description: "Monthly recurring revenue split by plan, region, and segment.",
    icon: TrendingUp,
    lastRun: "2 hours ago",
    rowCount: 186,
  },
  {
    slug: "churn-cohort",
    title: "Churn Cohort",
    description: "Retention decay per monthly cohort with churn reasons.",
    icon: TrendingDown,
    lastRun: "yesterday",
    rowCount: 144,
  },
  {
    slug: "ltv-by-plan",
    title: "LTV by Plan",
    description: "Lifetime value per subscriber grouped by subscription tier.",
    icon: Layers,
    lastRun: "3 days ago",
    rowCount: 42,
  },
  {
    slug: "revenue-by-region",
    title: "Revenue by Region",
    description: "Geographic revenue breakdown with YoY growth rate.",
    icon: Globe,
    lastRun: "5 days ago",
    rowCount: 24,
  },
  {
    slug: "top-customers",
    title: "Top Customers",
    description: "Highest-revenue accounts with plan, region, and contract age.",
    icon: Crown,
    lastRun: "1 hour ago",
    rowCount: 50,
  },
  {
    slug: "subscription-changes",
    title: "Subscription Changes",
    description: "All upgrades, downgrades, and cancellations with context.",
    icon: RefreshCw,
    lastRun: "6 hours ago",
    rowCount: 312,
  },
];

export function findReportTemplate(slug: string): ReportTemplate | undefined {
  return reportTemplates.find((t) => t.slug === slug);
}
