import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Dashboard",
  description: "Business Analytics SaaS Dashboard",
};

/**
 * WHY ThemeProvider wraps children inside <body>:
 * It's a client component that reads the Zustand theme store and
 * sets data-theme on <html> via useEffect after hydration.
 * This keeps the server-rendered HTML clean (no data-theme attribute)
 * so hydration matches perfectly. The attribute is set post-mount.
 *
 * A brief flash of light theme may occur for dark-mode users.
 * We'll solve this in Phase 2 with a cookie-based approach once
 * Auth.js is added (server reads theme from cookie → SSR correct theme).
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
{/* suppressHydrationWarning: browser extensions (e.g. Grammarly)
             inject attributes on <body> before React hydrates */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
