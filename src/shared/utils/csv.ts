/**
 * CSV serialization + browser download.
 *
 * WHY hand-rolled (no papaparse/csv-stringify):
 * Our mock datasets are small, shape-known, trusted strings/numbers —
 * no weird encoding, no giant streams, no parsing needed (we only write).
 * A third-party lib would be dead weight. When we do handle user-uploaded
 * CSVs (Phase 6+?) papaparse becomes justified — this stays write-only.
 *
 * WHY escape only when necessary:
 * Wrapping every cell in quotes works but bloats file size and makes
 * quick inspection in a text editor harder. Escaping only when a cell
 * contains a comma, quote, or newline matches what Excel/Sheets produce.
 *
 * RFC 4180 quirks handled:
 *   - Internal quotes are escaped by doubling ("" instead of \")
 *   - Cells with commas/newlines/quotes are wrapped in quotes
 *   - null/undefined serialize as empty string
 *   - Line separator is CRLF per RFC (safer cross-platform than LF)
 */

export interface CsvColumn<T> {
  key: keyof T & string;
  header: string;
  /** Optional formatter for cell values (e.g. currency, date). */
  format?: (value: T[keyof T & string], row: T) => string;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const headerLine = columns.map((c) => escapeCell(c.header)).join(",");
  const bodyLines = rows.map((row) =>
    columns
      .map((c) => {
        const raw = row[c.key];
        const formatted = c.format ? c.format(raw, row) : raw;
        return escapeCell(formatted);
      })
      .join(",")
  );
  return [headerLine, ...bodyLines].join("\r\n");
}

/**
 * Trigger a CSV file download in the browser. Uses a transient anchor
 * + object URL; revokes the URL right after to avoid memory leaks.
 */
export function downloadCsv(filename: string, csv: string): void {
  // BOM makes Excel treat the file as UTF-8 instead of showing mojibake
  // for any non-ASCII characters.
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCell(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
