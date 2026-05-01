import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Badge } from "@/shared/ui";

/**
 * LandingHero — the headline first-screen pitch.
 *
 * WHY a stylized "preview card" instead of a real screenshot:
 *   We don't have a polished hero screenshot yet. A composed-from-tokens
 *   preview card reads as intentional minimalism instead of "missing
 *   asset," and won't go stale when we change the dashboard. Swap to
 *   `<Image src="/og-hero.png" />` once we have a real shot.
 *
 * WHY two CTAs (Sign up + Try the demo):
 *   "Try the demo" is the killer link for portfolio reviewers — one
 *   click drops them into the live dashboard as a viewer. "Sign up"
 *   covers the standard SaaS funnel for any actual user.
 */
export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft radial glow behind the hero — no heavy assets needed. */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 -z-10
          [background:radial-gradient(80%_40%_at_50%_0%,var(--primary-subtle)_0%,transparent_60%)]
        "
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="flex flex-col gap-6">
            <Badge variant="primary" className="self-start">
              <span className="font-semibold tracking-wide">PULSE 2026</span>
              <span className="ml-2 text-text-tertiary">·</span>
              <span className="ml-2">Real-time SaaS analytics</span>
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              SaaS metrics,{" "}
              <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                live.
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Watch every dollar of MRR, every signup, every churn event the
              moment it happens. Cohort retention, customer 360, role-based
              access — all in one dashboard, no spreadsheets.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="
                  inline-flex items-center gap-2
                  rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white
                  shadow-sm transition-colors hover:bg-primary-hover
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-border-focus focus-visible:ring-offset-2
                "
              >
                Start free
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/login?demo=1"
                className="
                  inline-flex items-center gap-2
                  rounded-lg border border-border-default bg-bg-surface
                  px-5 py-2.5 text-sm font-medium text-text-secondary
                  transition-colors hover:bg-bg-muted hover:text-text-primary
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-border-focus
                "
              >
                <Play size={14} />
                Try the demo
              </Link>
            </div>
            <p className="text-xs text-text-tertiary">
              No credit card required · 14-day Pro trial · Cancel anytime
            </p>
          </div>

          <PreviewCard />
        </div>
      </div>
    </section>
  );
}

/**
 * Stylized "dashboard preview" — KPI cards + bar/line shapes.
 * Pure tokens, no assets.
 */
function PreviewCard() {
  return (
    <div
      aria-hidden
      className="
        relative rounded-2xl border border-border-default
        bg-bg-surface shadow-lg
        p-5 sm:p-6
      "
    >
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "MRR", value: "$48.2k", trend: "+12.4%" },
          { label: "Active", value: "2,184", trend: "+5.1%" },
          { label: "Churn", value: "3.2%", trend: "-0.6pp" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-border-subtle bg-bg-base p-3"
          >
            <div className="text-[10px] uppercase tracking-wide text-text-tertiary">
              {kpi.label}
            </div>
            <div className="mt-1 text-base font-semibold tabular-nums text-text-primary">
              {kpi.value}
            </div>
            <div className="text-[10px] tabular-nums text-success-text">
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>
      {/* Faux chart — gradient line shape */}
      <div className="rounded-lg border border-border-subtle bg-bg-base p-4">
        <div className="text-xs font-medium text-text-secondary mb-3">
          MRR · Last 30 days
        </div>
        <svg viewBox="0 0 320 100" className="w-full h-24">
          <defs>
            <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 78 L20 70 L40 72 L60 64 L80 58 L100 60 L120 50 L140 52 L160 44 L180 38 L200 42 L220 32 L240 30 L260 24 L280 22 L300 18 L320 16 L320 100 L0 100 Z"
            fill="url(#hero-fill)"
          />
          <path
            d="M0 78 L20 70 L40 72 L60 64 L80 58 L100 60 L120 50 L140 52 L160 44 L180 38 L200 42 L220 32 L240 30 L260 24 L280 22 L300 18 L320 16"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border-subtle bg-bg-base p-3">
          <div className="text-[10px] uppercase tracking-wide text-text-tertiary">
            Revenue by Plan
          </div>
          <div className="mt-2 flex h-6 overflow-hidden rounded-full">
            <div className="bg-primary" style={{ width: "60%" }} />
            <div className="bg-secondary" style={{ width: "32%" }} />
            <div className="bg-accent" style={{ width: "8%" }} />
          </div>
        </div>
        <div className="rounded-lg border border-border-subtle bg-bg-base p-3">
          <div className="text-[10px] uppercase tracking-wide text-text-tertiary">
            Recent signups
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <div className="h-2 w-3/4 rounded-full bg-bg-muted" />
            <div className="h-2 w-1/2 rounded-full bg-bg-muted" />
            <div className="h-2 w-2/3 rounded-full bg-bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
