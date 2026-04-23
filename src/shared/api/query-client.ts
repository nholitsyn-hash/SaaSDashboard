import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

/**
 * Query Client factory — one instance per browser tab, fresh per server render.
 *
 * WHY this factory pattern (not a module-level `new QueryClient()`):
 * A module-level instance would be shared across ALL incoming server
 * requests, leaking one user's cached data into another user's render.
 * Disaster. On the server we make a fresh client per render; in the
 * browser we cache a singleton so navigations keep warm data.
 *
 * WHY `isServer` from @tanstack/react-query:
 * Equivalent to `typeof window === "undefined"` but with the library's
 * own tree-shaking-friendly export. One less bespoke utility.
 *
 * WHY dehydrate also serializes "pending" queries:
 * With React Server Components, we can start a query on the server
 * (prefetch), stream it to the client partially-loaded, and let the
 * client resolve it from the server-initiated fetch. Serializing
 * pending state is what lets Suspense + prefetch work together.
 *
 * WHY staleTime: 60s default:
 * Tight enough that analytics feels fresh, loose enough that the same
 * user navigating back to a page they just left doesn't refetch every
 * chart. Pages that need real-time can override per-query.
 */

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // Fresh client per request — prevents cross-request leakage.
    return makeQueryClient();
  }
  // Browser: lazy singleton so Suspense-triggered re-renders don't
  // wipe the cache.
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
