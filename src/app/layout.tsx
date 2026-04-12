import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Dashboard",
  description: "Business Analytics SaaS Dashboard",
};

/**
 * WHY an inline script in <head>:
 * This runs BEFORE React hydrates, setting the data-theme attribute
 * on <html> immediately. Without this, users with dark mode preference
 * would see a flash of the light theme while React boots up (FOWT).
 *
 * WHY dangerouslySetInnerHTML:
 * Next.js doesn't support raw <script> children in Server Components.
 * This is one of the accepted patterns for blocking inline scripts.
 * The string is static (no user input), so there's no XSS risk.
 */
const themeScript = `
  (function() {
    var theme = localStorage.getItem('saas-dashboard-theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
