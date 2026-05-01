import { RegisterForm } from "@/features/auth";

/**
 * Register page — composes the RegisterForm feature.
 * Public per `proxy.ts`'s PUBLIC_ROUTES list (logged-in users get
 * redirected to /dashboard automatically).
 */
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-4 py-10">
      <RegisterForm />
    </main>
  );
}
