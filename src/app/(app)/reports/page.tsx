import { Plus } from "lucide-react";
import { Typography } from "@/shared/ui";
import { ReportTemplatesGrid } from "@/widgets/report-templates-grid";

/**
 * Reports — list of canned report templates (Phase 4, Step 4).
 * Clicking a card navigates to /reports/[slug] (Step 5).
 */
export default function ReportsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <Typography variant="h2">Reports</Typography>
            <Typography variant="body-sm">
              Run canned reports, customize filters, and export to CSV or PDF
            </Typography>
          </div>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="
              inline-flex items-center gap-2
              rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white
              shadow-sm transition-opacity
              disabled:opacity-60 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus focus-visible:ring-offset-2
            "
          >
            <Plus size={14} />
            New report
          </button>
        </header>

        <ReportTemplatesGrid />
      </div>
    </div>
  );
}
