import {
  Activity,
  BarChart3,
  FileDown,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

const features: Feature[] = [
  {
    icon: Activity,
    title: "Real-time MRR",
    description:
      "Every new subscription, upgrade, downgrade, and cancellation reflected the moment it happens.",
  },
  {
    icon: BarChart3,
    title: "Cohort retention",
    description:
      "12-month cohort heatmap and decay curves built in. Spot churn signals before they spread.",
  },
  {
    icon: Users,
    title: "Customer 360",
    description:
      "Every account, plan, region, and lifecycle stage in one searchable, filterable directory.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Three roles out of the box — viewer, admin, super admin — with proxy-level route protection.",
  },
  {
    icon: FileDown,
    title: "Reports + exports",
    description:
      "Six canned report templates, custom filters, and one-click CSV. PDF coming soon.",
  },
  {
    icon: Sparkles,
    title: "AI assistant",
    description:
      "Ask plain-English questions about your metrics — Claude answers from your live data.",
    badge: "Soon",
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24"
    >
      <SectionHeader
        eyebrow="Features"
        title="Everything you need, nothing you don't"
        subtitle="Built on real B2B SaaS workflows — not a generic dashboard template."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border-default bg-bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary-text">
          <Icon size={18} />
        </span>
        {feature.badge && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-secondary-text bg-secondary-subtle px-2 py-0.5 rounded-md">
            {feature.badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-text-primary">
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {feature.description}
      </p>
    </article>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="text-xs font-semibold uppercase tracking-wider text-primary-text">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base text-text-secondary">{subtitle}</p>
    </div>
  );
}
