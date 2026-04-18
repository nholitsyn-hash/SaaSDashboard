import { redirect } from "next/navigation";
import { auth } from "@/shared/api/auth";
import { Sidebar, SidebarDrawer } from "@/widgets/sidebar";
import { Topbar } from "@/widgets/topbar";

/**
 * App shell layout — wraps every authenticated route inside the sidebar +
 * topbar frame.
 *
 * WHY a route group `(app)`:
 * Parentheses wrap a folder into a route group — the folder name is
 * invisible in the URL. That lets us share one layout across many pages
 * (/dashboard, /analytics, /reports, …) without leaking `/app` into
 * every link. Contrast with a literal `/app/dashboard` path which would
 * be ugly and break existing bookmarks.
 *
 * WHY auth() + redirect here (not in each page):
 * The layout runs above every protected page. Centralizing the auth
 * check means a new /foo page under (app) is automatically protected —
 * no chance of forgetting it. Defense-in-depth stacks with the proxy's
 * faster JWT check.
 *
 * WHY we pass `user` into Topbar but `userRole` alone into Sidebar:
 * Topbar renders identity (avatar, name, email, role label) — needs the
 * full object. Sidebar only uses role for filtering the nav items.
 * Smaller prop surface = smaller re-render/memo boundary.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role,
  };

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/*
       * Skip link — WCAG SC 2.4.1. Visible only when focused.
       * Keyboard users tabbing into the page hit this first and can
       * jump past the sidebar's ~10 nav items straight to page content.
       */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:top-4 focus:left-4 focus:z-[60]
          focus:rounded-lg focus:bg-primary
          focus:px-4 focus:py-2 focus:text-sm focus:font-medium
          focus:text-white focus:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-border-focus
        "
      >
        Skip to main content
      </a>

      <Sidebar userRole={user.role} />
      <SidebarDrawer userRole={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
