import { ChevronDown } from "lucide-react";
import { SectionHeader } from "./LandingFeatures";

/**
 * LandingFaq — accessible accordion with native `<details>`.
 *
 * WHY native `<details>` (not Radix Accordion):
 *   `<details>` ships with built-in keyboard, focus, and screen-reader
 *   semantics for free. We get one CSS hook (`group-open:`) for animation
 *   and zero JS — perfect for a marketing page where bundle size matters.
 *   Radix is overkill here.
 */

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — every signup gets 14 days of full Pro features at no charge. No credit card required upfront. After the trial, you stay on Free unless you upgrade.",
  },
  {
    q: "How does role-based access work?",
    a: "Three roles — Viewer (read-only dashboards), Admin (full app access except billing/team), and Super Admin (everything). Routes are gated at the edge proxy AND the layout, so unauthorized pages are unreachable, not just hidden.",
  },
  {
    q: "What data sources do you support?",
    a: "Stripe and Paddle for payments, HubSpot and Slack for CRM and alerts, Segment and Google Analytics for events. More integrations land monthly. If we don't support yours, the API is documented.",
  },
  {
    q: "Can I export my data?",
    a: "Yes — every report exports to CSV in one click. PDF and scheduled email exports are available on Pro and Enterprise. Bulk exports via the API for Enterprise.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data stays available read-only for 30 days after cancellation. You can re-activate or export any time during that window. After 30 days it's permanently deleted unless you're on Enterprise with a custom retention policy.",
  },
  {
    q: "Is this a real product or a demo?",
    a: "This is a portfolio project demonstrating modern B2B SaaS analytics architecture: Next.js 16 App Router, Prisma + Neon, Auth.js v5, TanStack Query, ECharts, Feature-Sliced Design, and a fully role-gated multi-tenant data layer. Click 'Try the demo' to explore the product end-to-end.",
  },
];

export function LandingFaq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl px-4 sm:px-6 py-20 lg:py-24"
    >
      <SectionHeader
        eyebrow="FAQ"
        title="Questions, answered"
        subtitle="Can't find what you're looking for? Email us at hello@pulse.example."
      />

      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="
              group rounded-xl border border-border-default bg-bg-surface
              [&_summary::-webkit-details-marker]:hidden
            "
          >
            <summary
              className="
                flex cursor-pointer items-center justify-between gap-4
                px-5 py-4 text-sm font-medium text-text-primary
                marker:hidden
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded-xl
              "
            >
              {faq.q}
              <ChevronDown
                size={16}
                className="
                  shrink-0 text-text-tertiary
                  transition-transform group-open:rotate-180
                "
              />
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-text-secondary">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
