"use client";

import { useState, useEffect } from "react";

/**
 * useMounted — returns true after the component has mounted on the client.
 *
 * WHY this exists:
 * In Next.js, components render on the server first, then hydrate on the
 * client. Any value that differs between server and client (localStorage,
 * window size, Zustand persisted state) will cause a hydration mismatch.
 *
 * This hook lets you gate client-only content:
 *   const mounted = useMounted();
 *   return <p>{mounted ? clientValue : fallback}</p>
 *
 * The server and first client render both see `false` (matching HTML).
 * After mount, it flips to `true` and React updates the DOM normally.
 *
 * WHY in shared/hooks (not in the store):
 * This is a generic rendering utility — not tied to theme or any store.
 * Any component with a server/client mismatch can use it.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
