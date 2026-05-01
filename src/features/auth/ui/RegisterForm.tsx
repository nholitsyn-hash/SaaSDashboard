"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Card, Input, Button, Typography } from "@/shared/ui";
import { registerAction } from "../api/register-action";

/**
 * RegisterForm — credentials registration.
 *
 * WHY mirrors LoginForm structure:
 *   `useActionState` + `<form action={...}>` is the React 19 pattern
 *   for Server Actions. Login already follows it; staying consistent
 *   means anyone reading either form recognizes the shape immediately.
 *
 * WHY autoComplete hints:
 *   Browsers + password managers trust these tokens to fill the right
 *   fields and offer to save the new credential. `autoComplete="new-password"`
 *   specifically signals "this is a registration, not a login" — most
 *   managers will offer to generate a strong password.
 */
export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    (_prev: { error?: string }, formData: FormData) => registerAction(formData),
    {}
  );

  return (
    <Card className="w-full max-w-sm">
      <Card.Header>
        <Typography variant="h3">Create an account</Typography>
        <Typography variant="body-sm" className="mt-1">
          Start tracking your SaaS metrics — free for 14 days
        </Typography>
      </Card.Header>
      <Card.Body>
        <form action={formAction} className="space-y-4">
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
            name="name"
            label="Full name"
            placeholder="Jane Smith"
            autoComplete="name"
            required
          />

          <Input
            name="email"
            label="Work email"
            type="email"
            placeholder="jane@company.com"
            autoComplete="email"
            required
          />

          <Input
            name="companyName"
            label="Company name"
            placeholder="Acme Corp"
            autoComplete="organization"
            required
          />

          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>

          <p className="pt-2 text-center text-xs text-text-tertiary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-text hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Card.Body>
    </Card>
  );
}
