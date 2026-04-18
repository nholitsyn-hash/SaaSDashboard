import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { reportTemplates, type ReportTemplate } from "./mock";

/**
 * ReportTemplatesGrid — grid of clickable report-template cards.
 *
 * WHY cards with Link wrappers (not buttons):
 * Each card navigates to /reports/[slug]. Using <Link> gives proper
 * right-click "Open in new tab", keyboard Enter, screen-reader
 * "link to Top Customers" semantics — all native. A button + router.push
 * would lose those for no benefit.
 *
 * WHY whole-card hover + focus-visible ring:
 * The entire card is the hit target; subtle background lift on hover
 * + a ring on keyboard focus tells the user this whole thing is
 * interactive. Card styling + Link as a block element does this for free.
 */
export function ReportTemplatesGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {reportTemplates.map((template) => (
        <TemplateCard key={template.slug} template={template} />
      ))}
    </div>
  );
}

function TemplateCard({ template }: { template: ReportTemplate }) {
  const Icon = template.icon;

  return (
    <Link
      href={`/reports/${template.slug}`}
      className="
        group
        flex flex-col gap-3
        rounded-xl border border-border-default bg-bg-surface
        p-5 shadow-sm
        transition-colors
        hover:bg-bg-muted hover:border-border-strong
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-border-focus
      "
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="
            flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
            bg-primary-subtle text-primary-text
          "
        >
          <Icon size={18} />
        </span>
        <ArrowRight
          size={16}
          aria-hidden
          className="
            mt-3 text-text-muted
            transition-transform
            group-hover:translate-x-0.5 group-hover:text-text-secondary
          "
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">
          {template.title}
        </h3>
        <p className="text-xs text-text-secondary">{template.description}</p>
      </div>
      <div className="flex items-center justify-between pt-2 text-[11px] text-text-tertiary border-t border-border-subtle mt-1">
        <span className="tabular-nums">
          {template.rowCount.toLocaleString("en-US")} rows
        </span>
        <span>Last run · {template.lastRun}</span>
      </div>
    </Link>
  );
}
