"use client";

import { Toaster } from "sonner";
import { useThemeStore } from "@/shared/store/theme";
import { useMounted } from "@/shared/hooks/useMounted";

/**
 * AppToaster — sonner Toaster wired to our theme store.
 *
 * WHY a wrapper instead of mounting Toaster directly in the root layout:
 * sonner's `theme` prop needs the current app theme ("light"|"dark") so
 * toasts inherit the correct surface/text colors. Reading that from the
 * store requires a client component. The root layout is a server
 * component, so we isolate the client concern here and mount this
 * component instead.
 *
 * WHY useMounted fallback:
 * Zustand persist rehydrates after mount. If we rendered the true theme
 * on SSR and it mismatched the persisted client theme, we'd briefly show
 * a wrong-theme toast container — visible flicker. Defaulting to "light"
 * until mounted keeps SSR stable and updates after hydration.
 *
 * Placement (bottom-right, rich colors, close button):
 * bottom-right is the SaaS default (Linear, Vercel, Stripe). richColors
 * tints success/error/warning automatically. closeButton adds an X so
 * users can dismiss without waiting for the timer.
 */
export function AppToaster() {
  const theme = useThemeStore((s) => s.theme);
  const mounted = useMounted();

  return (
    <Toaster
      theme={mounted ? theme : "light"}
      position="bottom-right"
      richColors
      closeButton
    />
  );
}
