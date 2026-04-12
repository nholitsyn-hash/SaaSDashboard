import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import "./globals.css";

/**
 * WHY next/font/google instead of a <link> tag or @import:
 * next/font self-hosts the font files at build time — no requests
 * to Google's servers at runtime. This means:
 *   1. Better privacy (no data sent to Google on every page load)
 *   2. Faster load (font served from same origin, no DNS lookup)
 *   3. No layout shift (Next.js generates size-adjust CSS automatically)
 *
 * WHY Inter:
 * Industry standard for SaaS dashboards — clean, excellent readability
 * at small sizes (important for data tables and KPI labels), great
 * number rendering (tabular nums for aligned columns).
 *
 * WHY variable font with CSS variable:
 * A variable font is a single file covering all weights (400–700).
 * Assigning it to a CSS variable (--font-inter) lets us reference it
 * in the @theme block so Tailwind generates font-family utilities.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaaS Dashboard",
  description: "Business Analytics SaaS Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
