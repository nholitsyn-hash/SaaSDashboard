import { Suspense } from "react";
import { LoginForm } from "@/features/auth";

/**
 * Login page — composes the LoginForm feature.
 *
 * WHY <Suspense> wrapper:
 *   LoginForm now uses `useSearchParams()` to handle the `?demo=1`
 *   auto-fill from the landing page. Next.js requires any client
 *   component reading search params to be inside a Suspense boundary
 *   so that static rendering works for the rest of the page.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-10">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
