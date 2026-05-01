import {
  LandingHeader,
  LandingHero,
  LandingFeatures,
  LandingPricing,
  LandingFaq,
  LandingCta,
  LandingFooter,
} from "@/widgets/landing";

/**
 * Public marketing landing page.
 *
 * WHY RSC (no "use client"):
 *   The whole page is static markup + tokens. Only the header's ThemeToggle
 *   needs the client (and it's a tiny client island inside an otherwise
 *   server-rendered tree). Keeps initial HTML shippable, cacheable, and
 *   lightweight on JS.
 */
export default function LandingPage() {
  return (
    <div className="bg-bg-base">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingPricing />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
