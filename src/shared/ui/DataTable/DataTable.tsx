import type { ReactNode } from "react";

/**
 * DataTable — generic, headless-by-default tabular component.
 *
 * WHY generic <T> columns:
 * The consumer gives us the row type; we thread it through the column
 * render functions so `row.email` autocompletes and misspellings are
 * type errors. No `any`, no unsafe string-key lookups.
 *
 * WHY `getRowKey` is required:
 * React needs a stable, unique key per row. Using the array index is a
 * classic bug source — rows re-render oddly after sort/filter. Forcing
 * the consumer to tell us the key eliminates that class of bug.
 *
 * WHY visual-only in this pass:
 * Phase 3 UI pass — no handlers wired. Sort indicators + pagination
 * controls render as if interactive but are inert. Wiring happens in
 * pass 2 (data/interactions). Marking controls with `aria-disabled`
 * instead of `disabled` keeps the look without blocking future enablement.
 */

type ColumnAlign = "left" | "center" | "right";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: ColumnAlign;
  width?: string;
  sortable?: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  toolbar?: ReactNode;
  pagination?: PaginationState;
  emptyState?: ReactNode;
  className?: string;
}

const alignClass: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  toolbar,
  pagination,
  emptyState,
  className = "",
}: DataTableProps<T>) {
  const isEmpty = rows.length === 0;

  return (
    <section
      className={`
        rounded-xl border border-border-default
        bg-bg-surface shadow-sm
        flex flex-col
        ${className}
      `}
    >
      {toolbar && (
        <div className="flex items-center justify-between gap-3 border-b border-border-default px-5 py-3">
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-default">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={`
                    px-5 py-3 text-xs font-medium text-text-tertiary
                    uppercase tracking-wide
                    ${alignClass[col.align ?? "left"]}
                  `}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span
                        aria-hidden
                        className="text-text-muted"
                        title="Sortable"
                      >
                        ↕
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-text-tertiary"
                >
                  {emptyState ?? "No data to display"}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-border-subtle last:border-0 hover:bg-bg-muted/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-5 py-3 text-text-secondary
                        ${alignClass[col.align ?? "left"]}
                      `}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <PaginationBar {...pagination} />
      )}
    </section>
  );
}

function PaginationBar({ page, pageSize, total }: PaginationState) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const isFirst = page <= 1;
  const isLast = page >= lastPage;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-border-default px-5 py-3 text-xs text-text-tertiary">
      <span className="tabular-nums">
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <PaginationButton disabled={isFirst} label="Previous page">
          ←
        </PaginationButton>
        <span className="tabular-nums px-2">
          Page {page} / {lastPage}
        </span>
        <PaginationButton disabled={isLast} label="Next page">
          →
        </PaginationButton>
      </div>
    </div>
  );
}

interface PaginationButtonProps {
  children: ReactNode;
  disabled?: boolean;
  label: string;
}

function PaginationButton({
  children,
  disabled,
  label,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={`
        inline-flex h-7 w-7 items-center justify-center
        rounded-md border border-border-default
        bg-bg-surface text-text-secondary
        transition-colors
        hover:bg-bg-muted
        aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:hover:bg-bg-surface
      `}
    >
      {children}
    </button>
  );
}
