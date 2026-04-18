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
      <Sidebar userRole={user.role} />
      <SidebarDrawer userRole={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
