import { LoginForm } from "@/features/auth";

/**
 * Login page — composes the LoginForm feature.
 *
 * WHY no business logic here:
 * FSD rule: app/ contains routing and layout only.
 * All auth logic lives in features/auth/.
 * This page just centers the form on screen.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <LoginForm />
    </main>
  );
}
