"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/shared/ui";

/**
 * LandingHeader — sticky public marketing header.
 *
 * WHY anchor links (#features) instead of routes:
 *   This is a single-scroll landing. Smooth scroll within the page
 *   reads as polished + matches Linear/Vercel/Stripe convention.
 *   When we later split into multiple pages, `<a>` anchors → `<Link>` routes
 *   is a one-line change per item.
 *
 * WHY `Activity` icon for the brand:
 *   Pulse = heartbeat. lucide's `Activity` is the heart-rate-line icon —
 *   the most literal mark for the brand without a custom logo.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-default bg-bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-text-primary"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
            <Activity size={16} strokeWidth={2.5} />
          </span>
          <span className="text-base">Pulse</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <NavAnchor href="#features">Features</NavAnchor>
          <NavAnchor href="#pricing">Pricing</NavAnchor>
          <NavAnchor href="#faq">FAQ</NavAnchor>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="
              hidden rounded-md px-3 py-1.5 text-sm font-medium
              text-text-secondary transition-colors
              hover:bg-bg-muted hover:text-text-primary
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus
              sm:inline-flex
            "
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="
              inline-flex items-center rounded-lg
              bg-primary px-3 py-1.5 text-sm font-medium text-white
              shadow-sm transition-colors hover:bg-primary-hover
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-border-focus focus-visible:ring-offset-2
            "
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="
        rounded-md px-3 py-1.5 text-sm font-medium
        text-text-secondary transition-colors
        hover:bg-bg-muted hover:text-text-primary
      "
    >
      {children}
    </a>
  );
}
