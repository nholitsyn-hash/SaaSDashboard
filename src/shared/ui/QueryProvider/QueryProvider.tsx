"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/shared/api/query-client";

/**
 * QueryProvider — mounts QueryClientProvider + devtools.
 *
 * WHY a tiny client wrapper:
 * Root layout is an RSC; QueryClientProvider must run on the client.
 * The factory (`getQueryClient`) is server-safe — it returns the right
 * kind of client depending on runtime. This wrapper just bridges the
 * RSC boundary.
 *
 * WHY devtools mounted unconditionally:
 * `ReactQueryDevtools` already tree-shakes out of production builds —
 * no guard needed. `initialIsOpen={false}` keeps the toggle out of
 * sight until a dev clicks the floating icon.
 */
export function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
