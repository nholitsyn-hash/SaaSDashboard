"use client";

import { useState } from "react";
import { DateRangePicker, Typography, type DatePreset } from "@/shared/ui";

/**
 * AnalyticsHeader — page title + subtitle + DateRangePicker.
 *
 * WHY a client-only wrapper (not inlining DateRangePicker on the page):
 * DateRangePicker needs local state + event handlers; that forces a
 * client component. Extracting the filter bar keeps the page itself an
 * RSC — server components host the mock-data-driven chart composition
 * without needing to bundle this interactive piece as client code.
 *
 * WHY state local (not lifted yet):
 * Pass 1 is visual only — no chart actually consumes the selected range.
 * Pass 2 will lift the range into a shared store (Zustand) or URL param
 * so every chart can subscribe. Starting with local state avoids
 * premature abstraction.
 */
export function AnalyticsHeader() {
  const [range, setRange] = useState<DatePreset>("30d");

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <Typography variant="h2">Analytics</Typography>
        <Typography variant="body-sm">
          Cohorts, retention, revenue movement, and segmentation
        </Typography>
      </div>
      <DateRangePicker value={range} onChange={setRange} />
    </header>
  );
}
