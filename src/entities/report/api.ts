"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { z } from "zod";

/**
 * Report rows — generic data hook for the dynamic /reports/[slug] page.
 *
 * WHY a single generic hook (not 6 named hooks):
 *   Each report has a different row shape but the wire envelope is
 *   identical: `{ rows: T[] }`. Passing the per-slug Zod schema lets one
 *   hook stay fully typed without a hook explosion. The schema doubles as
 *   runtime validation — same drift-protection pattern we use everywhere.
 *
 * WHY queryKey includes the slug:
 *   Each report is its own cache entry. Switching slug = different
 *   queryKey = independent fetch. No cross-pollution between reports.
 */

export const reportKeys = {
  all: ["reports"] as const,
  rows: (slug: string) => [...reportKeys.all, "rows", slug] as const,
};

export function useReport<T>(
  slug: string,
  rowSchema: z.ZodType<T>
): UseQueryResult<T[], Error> {
  return useQuery({
    queryKey: reportKeys.rows(slug),
    queryFn: async () => {
      const res = await fetch(`/api/reports/${slug}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        let message = `Request failed with ${res.status}`;
        try {
          const body = (await res.json()) as { error?: string };
          if (body?.error) message = body.error;
        } catch {
          /* not JSON */
        }
        throw new Error(message);
      }
      const json: unknown = await res.json();
      const parsed = z.object({ rows: z.array(rowSchema) }).parse(json);
      return parsed.rows;
    },
  });
}
