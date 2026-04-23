"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  DataTable,
  DateRangePicker,
  ExportMenu,
  Typography,
  type DatePreset,
} from "@/shared/ui";
import { downloadCsv, toCsv } from "@/shared/utils/csv";
import {
  findReportTemplate,
  type ReportSlug,
  type ReportTemplate,
} from "@/widgets/report-templates-grid/mock";
import { mrrRows, mrrColumns, mrrCsvColumns, type MrrRow } from "./mocks/mrr-breakdown";
import { churnCohortRows, churnCohortColumns, churnCohortCsvColumns, type ChurnCohortRow } from "./mocks/churn-cohort";
import { ltvRows, ltvColumns, ltvCsvColumns, type LtvRow } from "./mocks/ltv-by-plan";
import { regionRows, regionColumns, regionCsvColumns, type RegionRow } from "./mocks/revenue-by-region";
import { topCustomerRows, topCustomerColumns, topCustomerCsvColumns, type TopCustomerRow } from "./mocks/top-customers";
import { subChangeRows, subChangeColumns, subChangeCsvColumns, type SubChangeRow } from "./mocks/subscription-changes";

/**
 * ReportDetail — header + filter bar + DataTable + working CSV export.
 *
 * WHY slug-dispatch to typed subcomponents (not a generic row type):
 * Each report has a different row shape. A generic `ReportDetail<T>`
 * would force every caller to know T, or we'd lose types with `any`.
 * Switching to typed per-report subcomponents keeps every table fully
 * typed end-to-end (rows, columns, csv mapping) without any casts.
 *
 * WHY CSV filename includes today's date:
 * Users downloading multiple reports shouldn't overwrite the last one.
 * ISO date suffix is stable, sortable, and reads correctly everywhere.
 *
 * WHY PDF via toast (not real implementation):
 * Proper PDF export needs jsPDF or a server-side renderer. Both are
 * heavy for what's currently a "nice to have." Stubbing with a friendly
 * toast keeps the button present and the UX honest.
 */

interface ReportDetailProps {
  slug: ReportSlug;
}

export function ReportDetail({ slug }: ReportDetailProps) {
  // Re-lookup on the client side — the parent server component couldn't
  // pass the full template because `icon` is a React function component
  // (not serializable across the RSC boundary). Cheap, pure lookup here.
  const template = findReportTemplate(slug);
  if (!template) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 print:p-0">
      <div className="mx-auto max-w-7xl space-y-6 print:max-w-none">
        <ReportHeader template={template} />
        <ReportBody slug={template.slug} />
      </div>
    </div>
  );
}

function ReportHeader({ template }: { template: ReportTemplate }) {
  return (
    <header className="flex flex-col gap-3">
      <Link
        href="/reports"
        className="
          inline-flex items-center gap-1 text-xs font-medium text-text-tertiary
          transition-colors hover:text-text-primary
          focus-visible:outline-none focus-visible:underline
          print:hidden
        "
      >
        <ArrowLeft size={14} />
        Back to reports
      </Link>
      <div className="flex flex-col gap-1">
        <Typography variant="h2">{template.title}</Typography>
        <Typography variant="body-sm">{template.description}</Typography>
      </div>
    </header>
  );
}

function ReportBody({ slug }: { slug: ReportTemplate["slug"] }) {
  switch (slug) {
    case "mrr-breakdown":
      return <ReportView<MrrRow> slug={slug} rows={mrrRows} columns={mrrColumns} csvColumns={mrrCsvColumns} />;
    case "churn-cohort":
      return <ReportView<ChurnCohortRow> slug={slug} rows={churnCohortRows} columns={churnCohortColumns} csvColumns={churnCohortCsvColumns} />;
    case "ltv-by-plan":
      return <ReportView<LtvRow> slug={slug} rows={ltvRows} columns={ltvColumns} csvColumns={ltvCsvColumns} />;
    case "revenue-by-region":
      return <ReportView<RegionRow> slug={slug} rows={regionRows} columns={regionColumns} csvColumns={regionCsvColumns} />;
    case "top-customers":
      return <ReportView<TopCustomerRow> slug={slug} rows={topCustomerRows} columns={topCustomerColumns} csvColumns={topCustomerCsvColumns} />;
    case "subscription-changes":
      return <ReportView<SubChangeRow> slug={slug} rows={subChangeRows} columns={subChangeColumns} csvColumns={subChangeCsvColumns} />;
  }
}

interface ReportViewProps<T extends { id: string }> {
  slug: string;
  rows: T[];
  columns: React.ComponentProps<typeof DataTable<T>>["columns"];
  csvColumns: Parameters<typeof toCsv<T>>[1];
}

function ReportView<T extends { id: string }>({
  slug,
  rows,
  columns,
  csvColumns,
}: ReportViewProps<T>) {
  const [range, setRange] = useState<DatePreset>("30d");

  const handleExportCsv = () => {
    const csv = toCsv(rows, csvColumns);
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`${slug}-${today}.csv`, csv);
    toast.success("CSV exported", {
      description: `${rows.length} rows downloaded`,
    });
  };

  const handleExportPdf = () => {
    toast.info("PDF export coming soon", {
      description: "For now, use your browser's Print → Save as PDF",
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <DateRangePicker value={range} onChange={setRange} />
        <div className="ml-auto">
          <ExportMenu
            onExportCsv={handleExportCsv}
            onExportPdf={handleExportPdf}
          />
        </div>
      </div>

      <DataTable<T>
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        pagination={{ page: 1, pageSize: rows.length, total: rows.length }}
      />
    </>
  );
}
