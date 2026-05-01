"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Button,
  DataTable,
  DateRangePicker,
  ExportMenu,
  Typography,
  type Column,
  type DatePreset,
} from "@/shared/ui";
import { downloadCsv, toCsv, type CsvColumn } from "@/shared/utils/csv";
import { useReport } from "@/entities/report";
import {
  findReportTemplate,
  type ReportSlug,
  type ReportTemplate,
} from "@/widgets/report-templates-grid/mock";
import {
  MrrRowSchema,
  mrrColumns,
  mrrCsvColumns,
  type MrrRow,
} from "./mocks/mrr-breakdown";
import {
  ChurnCohortRowSchema,
  churnCohortColumns,
  churnCohortCsvColumns,
  type ChurnCohortRow,
} from "./mocks/churn-cohort";
import {
  LtvRowSchema,
  ltvColumns,
  ltvCsvColumns,
  type LtvRow,
} from "./mocks/ltv-by-plan";
import {
  RegionRowSchema,
  regionColumns,
  regionCsvColumns,
  type RegionRow,
} from "./mocks/revenue-by-region";
import {
  TopCustomerRowSchema,
  topCustomerColumns,
  topCustomerCsvColumns,
  type TopCustomerRow,
} from "./mocks/top-customers";
import {
  SubChangeRowSchema,
  subChangeColumns,
  subChangeCsvColumns,
  type SubChangeRow,
} from "./mocks/subscription-changes";

/**
 * ReportDetail — header + filter bar + DataTable with hook-fetched rows.
 *
 * WHY slug-dispatch to typed sub-components (not generic ReportView<T>):
 *   Each report has a different row shape. Switching at the page level
 *   keeps every ReportView fully typed end-to-end (rows, columns, CSV
 *   mapping) — no `any` casts anywhere.
 *
 * WHY each ReportView calls its own `useReport(slug, schema)`:
 *   Per-slug Zod schema means runtime validation per report; TanStack
 *   queryKey includes the slug so each report has an independent cache
 *   entry.
 */

interface ReportDetailProps {
  slug: ReportSlug;
}

export function ReportDetail({ slug }: ReportDetailProps) {
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
      return (
        <ReportView<MrrRow>
          slug={slug}
          schema={MrrRowSchema}
          columns={mrrColumns}
          csvColumns={mrrCsvColumns}
        />
      );
    case "churn-cohort":
      return (
        <ReportView<ChurnCohortRow>
          slug={slug}
          schema={ChurnCohortRowSchema}
          columns={churnCohortColumns}
          csvColumns={churnCohortCsvColumns}
        />
      );
    case "ltv-by-plan":
      return (
        <ReportView<LtvRow>
          slug={slug}
          schema={LtvRowSchema}
          columns={ltvColumns}
          csvColumns={ltvCsvColumns}
        />
      );
    case "revenue-by-region":
      return (
        <ReportView<RegionRow>
          slug={slug}
          schema={RegionRowSchema}
          columns={regionColumns}
          csvColumns={regionCsvColumns}
        />
      );
    case "top-customers":
      return (
        <ReportView<TopCustomerRow>
          slug={slug}
          schema={TopCustomerRowSchema}
          columns={topCustomerColumns}
          csvColumns={topCustomerCsvColumns}
        />
      );
    case "subscription-changes":
      return (
        <ReportView<SubChangeRow>
          slug={slug}
          schema={SubChangeRowSchema}
          columns={subChangeColumns}
          csvColumns={subChangeCsvColumns}
        />
      );
  }
}

interface ReportViewProps<T extends { id: string }> {
  slug: string;
  schema: z.ZodType<T>;
  columns: Column<T>[];
  csvColumns: CsvColumn<T>[];
}

function ReportView<T extends { id: string }>({
  slug,
  schema,
  columns,
  csvColumns,
}: ReportViewProps<T>) {
  const [range, setRange] = useState<DatePreset>("30d");
  const { data, isLoading, isError, error, refetch } = useReport<T>(
    slug,
    schema
  );
  const rows = data ?? [];

  const handleExportCsv = () => {
    if (rows.length === 0) {
      toast.info("Nothing to export yet");
      return;
    }
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

  const emptyState = isLoading
    ? "Loading report…"
    : isError
      ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-danger-text">
            {error?.message ?? "Failed to load report"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
      : "No rows in this report";

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
        pagination={{
          page: 1,
          pageSize: rows.length || 1,
          total: rows.length,
        }}
        emptyState={emptyState}
      />
    </>
  );
}
