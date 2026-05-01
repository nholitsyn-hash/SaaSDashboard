import { Activity } from "lucide-react";

const sections: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Integrations", href: "#features" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border-default bg-bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
                <Activity size={16} strokeWidth={2.5} />
              </span>
              <span className="text-base font-semibold text-text-primary">
                Pulse
              </span>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed">
              SaaS metrics, live. Built with Next.js 16, Prisma, and ECharts.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                {section.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border-subtle pt-6 text-xs text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Pulse. Portfolio project — not a real product.</p>
          <p>Made for showing off, with care.</p>
        </div>
      </div>
    </footer>
  );
}
