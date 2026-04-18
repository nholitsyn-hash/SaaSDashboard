import type { ReactNode } from "react";

/**
 * KpiCard — headline metric tile.
 *
 * WHY a structured `delta` object instead of 3 separate props:
 * label + value + trend + trendLabel always travel together. Bundling them
 * makes misuse impossible (can't pass trend without value). Consumers
 * format the string themselves (e.g. "+12%" or "+$450") — the component
 * stays presentation-only.
 *
 * WHY container queries (@container + @sm:):
 * In a 4-column KPI row the card is wide; stacked on mobile it's narrow.
 * Rather than key off the viewport, we key off the card's own container
 * so the same component adapts anywhere it's placed (e.g. a wider sidebar
 * insert would also benefit). This is the modern Tailwind v4 pattern.
 */

export type KpiTrend = "up" | "down" | "neutral";

export interface KpiDelta {
  value: string;
  trend: KpiTrend;
  label?: string;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: KpiDelta;
  icon?: ReactNode;
  sparkline?: ReactNode;
  className?: string;
}

const trendStyles: Record<KpiTrend, string> = {
  up: "bg-success-subtle text-success-text",
  down: "bg-danger-subtle text-danger-text",
  neutral: "bg-bg-muted text-text-secondary",
};

const trendArrow: Record<KpiTrend, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

export function KpiCard({
  label,
  value,
  delta,
  icon,
  sparkline,
  className = "",
}: KpiCardProps) {
  return (
    <article
      className={`
        @container
        rounded-xl border border-border-default
        bg-bg-surface shadow-sm
        p-5
        flex flex-col gap-3
        ${className}
      `}
    >
      <header className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-muted text-text-secondary"
          >
            {icon}
          </span>
        )}
      </header>

      <div className="text-3xl font-semibold tracking-tight text-text-primary tabular-nums">
        {value}
      </div>

      {(delta || sparkline) && (
        <footer className="flex items-center justify-between gap-3">
          {delta && (
            <span
              className={`
                inline-flex items-center gap-1
                rounded-md px-2 py-0.5
                text-xs font-medium tabular-nums
                ${trendStyles[delta.trend]}
              `}
            >
              <span aria-hidden>{trendArrow[delta.trend]}</span>
              <span>{delta.value}</span>
              {delta.label && (
                <span className="text-text-tertiary font-normal hidden @[220px]:inline">
                  {delta.label}
                </span>
              )}
            </span>
          )}
          {sparkline && (
            <div className="flex-1 min-w-0 h-8">
              {sparkline}
            </div>
          )}
        </footer>
      )}
    </article>
  );
}
