import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function LandingCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-24">
      <div
        className="
          relative overflow-hidden
          rounded-3xl border border-border-default
          bg-gradient-to-br from-primary to-secondary
          px-6 py-12 sm:px-12 sm:py-16
        "
      >
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0
            [background:radial-gradient(60%_60%_at_70%_30%,rgba(255,255,255,0.18),transparent_60%)]
          "
        />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stop guessing. Start watching.
          </h2>
          <p className="max-w-xl text-base text-white/80">
            Sign up in 30 seconds — or click "Try the demo" to explore the
            full product as a viewer with seeded data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="
                inline-flex items-center gap-2
                rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-text-primary
                shadow-sm transition-opacity hover:opacity-90
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary
              "
            >
              Start free
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/login?demo=1"
              className="
                inline-flex items-center gap-2
                rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white
                backdrop-blur transition-colors hover:bg-white/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary
              "
            >
              <Play size={14} />
              Try the demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
