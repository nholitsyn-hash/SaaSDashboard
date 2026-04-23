import { notFound } from "next/navigation";
import { ReportDetail } from "@/widgets/report-detail";
import { findReportTemplate } from "@/widgets/report-templates-grid/mock";

/**
 * Dynamic report route.
 *
 * WHY params is a Promise in Next 16:
 * App Router delivers route params asynchronously so layouts/pages can be
 * streamed. Await before destructuring.
 *
 * WHY notFound() on unknown slug:
 * Triggers Next's built-in 404 — correct HTTP status, proper UX. Any
 * string that isn't in our known template list returns 404.
 *
 * WHY we only pass the slug (not the full template) to ReportDetail:
 * `ReportTemplate` contains an `icon: LucideIcon` field — a React component
 * function. Server→client props must be serializable, and functions
 * aren't. The client re-looks-up the template from the same pure helper
 * on its side of the boundary. The server's only job here is the 404
 * decision + slug handoff.
 */
export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = findReportTemplate(slug);
  if (!template) {
    notFound();
  }

  return <ReportDetail slug={template.slug} />;
}
