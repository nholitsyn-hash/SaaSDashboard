"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { ShieldCheck, User } from "lucide-react";
import { Card, Input, Button, Typography } from "@/shared/ui";
import { loginAction } from "../api/login-action";

/**
 * LoginForm — credentials login + demo-account quick fill.
 *
 * WHY controlled inputs (lifted state):
 *   The demo cards need to programmatically prefill email/password. With
 *   uncontrolled inputs you'd have to reach into the DOM. Lifting state
 *   keeps everything React-flow + lets `?demo=1` auto-submit cleanly.
 *
 * WHY useActionState still works with controlled inputs:
 *   The form's `action` is the Server Action. On submit, native form
 *   submission collects FormData from input `name` attrs — controlled
 *   `value` doesn't change that. Best of both: React state for UX,
 *   FormData for the server payload.
 *
 * WHY `?demo=1` auto-submits:
 *   The "Try the demo" button on the landing page needs to be ONE click
 *   to dashboard, not two (fill, then submit). useEffect reads the param,
 *   prefills, and calls `requestSubmit()` on the form ref.
 */

interface DemoAccount {
  label: string;
  email: string;
  password: string;
  description: string;
  icon: typeof ShieldCheck;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Super Admin",
    email: "admin@example.com",
    password: "password123",
    description: "Full access — dashboards, reports, admin pages",
    icon: ShieldCheck,
  },
  {
    label: "Viewer",
    email: "demo@example.com",
    password: "password123",
    description: "Read-only — admin pages hidden via role-based access",
    icon: User,
  },
];

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    (_prevState: { error?: string }, formData: FormData) =>
      loginAction(formData),
    {}
  );

  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const autoSubmittedRef = useRef(false);

  // ?demo=1 → prefill the viewer credentials and auto-submit once.
  useEffect(() => {
    if (autoSubmittedRef.current) return;
    if (searchParams?.get("demo") !== "1") return;

    const viewer = DEMO_ACCOUNTS.find((a) => a.label === "Viewer");
    if (!viewer) return;

    autoSubmittedRef.current = true;
    setEmail(viewer.email);
    setPassword(viewer.password);
    // Wait for state to flush + form fields to update before submitting.
    requestAnimationFrame(() => formRef.current?.requestSubmit());
  }, [searchParams]);

  const fillDemo = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <Card>
        <Card.Header>
          <Typography variant="h3">Sign in</Typography>
          <Typography variant="body-sm" className="mt-1">
            Enter your credentials to access the dashboard
          </Typography>
        </Card.Header>
        <Card.Body>
          <form ref={formRef} action={formAction} className="space-y-4">
            {state.error && (
              <div
                role="alert"
                className="rounded-lg bg-danger-subtle px-3 py-2"
              >
                <Typography variant="body-sm" className="text-danger-text">
                  {state.error}
                </Typography>
              </div>
            )}

            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>

            <p className="pt-2 text-center text-xs text-text-tertiary">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary-text hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Card.Body>
      </Card>

      <DemoAccountsCard onFill={fillDemo} />
    </div>
  );
}

function DemoAccountsCard({ onFill }: { onFill: (a: DemoAccount) => void }) {
  return (
    <Card>
      <Card.Header>
        <Typography variant="h4">Demo accounts</Typography>
        <Typography variant="body-sm" className="mt-1">
          Click to prefill — both use{" "}
          <code className="rounded bg-bg-muted px-1 py-0.5 text-[11px]">
            password123
          </code>
        </Typography>
      </Card.Header>
      <Card.Body className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon;
          return (
            <button
              key={account.label}
              type="button"
              onClick={() => onFill(account)}
              className="
                flex w-full items-start gap-3 rounded-lg
                border border-border-default bg-bg-surface p-3
                text-left transition-colors
                hover:bg-bg-muted hover:border-border-strong
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-border-focus
              "
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary-text">
                <Icon size={14} />
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-text-primary">
                  {account.label}
                </span>
                <span className="text-xs text-text-tertiary truncate">
                  {account.email}
                </span>
                <span className="text-[11px] text-text-secondary">
                  {account.description}
                </span>
              </div>
            </button>
          );
        })}
      </Card.Body>
    </Card>
  );
}
