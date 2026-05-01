import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeader } from "./LandingFeatures";

interface PricingTier {
  name: "Free" | "Pro" | "Enterprise";
  priceLabel: string;
  priceSuffix?: string;
  description: string;
  highlight?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    priceLabel: "$0",
    priceSuffix: "forever",
    description: "Everything you need to start watching your numbers.",
    features: [
      "1 user",
      "Up to 100 customers",
      "Core dashboard + KPIs",
      "30-day data retention",
      "Email support",
    ],
    ctaLabel: "Start free",
    ctaHref: "/register",
  },
  {
    name: "Pro",
    priceLabel: "$99",
    priceSuffix: "/month",
    description: "For growing teams who care about every metric.",
    highlight: true,
    features: [
      "Up to 10 users",
      "Up to 5,000 customers",
      "All charts + cohort analytics",
      "CSV export, role-based access",
      "Stripe + Paddle integrations",
      "Priority email + chat support",
    ],
    ctaLabel: "Start 14-day Pro trial",
    ctaHref: "/register?plan=pro",
  },
  {
    name: "Enterprise",
    priceLabel: "Custom",
    description: "For larger orgs with serious data and serious requirements.",
    features: [
      "Unlimited users",
      "Unlimited customers",
      "Custom integrations + SSO",
      "Audit logs, SLA, dedicated CSM",
      "PDF + scheduled exports",
      "Direct Slack channel with our team",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "mailto:hello@pulse.example",
  },
];

export function LandingPricing() {
  return (
    <section
      id="pricing"
      className="bg-bg-muted/40 border-y border-border-subtle"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans, transparent prices"
          subtitle="Start free, upgrade when your numbers demand it. No hidden fees, no per-seat surprises."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-text-tertiary">
          All plans include the same data engine — pricing only changes scale and support.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <article
      className={`
        relative flex flex-col gap-6 rounded-2xl border p-6 shadow-sm
        ${
          tier.highlight
            ? "border-primary bg-bg-surface ring-2 ring-primary/30"
            : "border-border-default bg-bg-surface"
        }
      `}
    >
      {tier.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Most popular
        </span>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-text-primary">{tier.name}</h3>
        <p className="text-sm text-text-secondary">{tier.description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight text-text-primary tabular-nums">
          {tier.priceLabel}
        </span>
        {tier.priceSuffix && (
          <span className="text-sm text-text-tertiary">{tier.priceSuffix}</span>
        )}
      </div>

      <Link
        href={tier.ctaHref}
        className={
          tier.highlight
            ? `
              inline-flex items-center justify-center
              rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white
              shadow-sm transition-colors hover:bg-primary-hover
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2
            `
            : `
              inline-flex items-center justify-center
              rounded-lg border border-border-default bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary
              transition-colors hover:bg-bg-muted hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
            `
        }
      >
        {tier.ctaLabel}
      </Link>

      <ul className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
        {tier.features.map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-sm text-text-secondary"
          >
            <Check size={14} className="mt-0.5 shrink-0 text-success" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
