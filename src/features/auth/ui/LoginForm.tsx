"use client";

import { useActionState } from "react";
import { Card, Input, Button, Typography } from "@/shared/ui";
import { loginAction } from "../api/login-action";

/**
 * LoginForm — credentials login form.
 *
 * WHY useActionState (React 19):
 * useActionState is the React 19 primitive for handling Server Action
 * state. It replaces the old pattern of useState + manual fetch.
 * Benefits:
 *   1. Automatic pending state (isPending) — no useState for loading
 *   2. Works with progressive enhancement (form submits without JS)
 *   3. Automatically re-renders with the action's return value
 *
 * WHY name attributes on inputs:
 * Server Actions receive FormData, which reads values by name.
 * Without name="email", formData.get("email") returns null.
 */
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    (_prevState: { error?: string }, formData: FormData) =>
      loginAction(formData),
    {}
  );

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Typography variant="h3">Sign in</Typography>
        <Typography variant="body-sm" className="mt-1">
          Enter your credentials to access the dashboard
        </Typography>
      </Card.Header>
      <Card.Body>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-danger-subtle px-3 py-2">
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
            required
          />

          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
}
