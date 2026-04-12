"use client";

import { useTheme } from "@/shared/hooks/useTheme";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-bg-base p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">
          SaaS Dashboard — Token Test
        </h1>
        <p className="text-text-secondary">
          Current theme: {theme}
        </p>
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-primary px-4 py-2 text-text-on-primary shadow-sm"
        >
          Toggle Theme
        </button>
        <div className="rounded-xl border border-border-default bg-bg-surface p-6 shadow-md">
          <p className="text-text-primary">Surface card with border and shadow</p>
        </div>
        <div className="flex gap-3">
          <span className="rounded-md bg-success-subtle px-3 py-1 text-success-text">Success</span>
          <span className="rounded-md bg-warning-subtle px-3 py-1 text-warning-text">Warning</span>
          <span className="rounded-md bg-danger-subtle px-3 py-1 text-danger-text">Danger</span>
        </div>
      </div>
    </main>
  );
}
