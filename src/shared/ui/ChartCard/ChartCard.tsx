import type { ReactNode } from "react";

/**
 * ChartCard — titled container for any chart body.
 *
 * WHY a fixed `height` prop (required):
 * ECharts resizes to fill its parent. If the parent has no explicit height,
 * ECharts sees `0` and refuses to render (or renders at 1px). Forcing a
 * numeric height here makes widgets consistent and prevents that footgun —
 * the widget doesn't have to remember to set height on its own wrapper.
 *
 * WHY composed on top of Card semantics (inline, not reusing <Card>):
 * <Card> has its own padding on Body; charts need the body to be edge-to-edge
 * so the canvas fills the card. Copying the surface + header treatment and
 * dropping padding on body is simpler than overriding Card from outside.
 */

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  height?: number;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  action,
  height = 320,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <article
      className={`
        @container
        rounded-xl border border-border-default
        bg-bg-surface shadow-sm
        flex flex-col
        ${className}
      `}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>

      <div className="px-2 pb-2" style={{ height }}>
        {children}
      </div>
    </article>
  );
}
