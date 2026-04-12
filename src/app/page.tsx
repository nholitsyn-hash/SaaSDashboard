"use client";

import { useState } from "react";
import { useThemeStore } from "@/shared/store/theme";
import { useMounted } from "@/shared/hooks/useMounted";
import {
  Button,
  Badge,
  Card,
  Input,
  Toggle,
  Typography,
} from "@/shared/ui";

/**
 * Component Showcase — temporary page to visually verify all shared/ui
 * components and theme switching before moving to Phase 2.
 * Will be replaced by the actual dashboard later.
 */
export default function ShowcasePage() {
  const { theme, toggleTheme } = useThemeStore();
  const mounted = useMounted();
  const [inputValue, setInputValue] = useState("");
  const [toggleState, setToggleState] = useState(false);

  return (
    <main className="min-h-screen bg-bg-base px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* ── Header + Theme Toggle ── */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1">UI Component Showcase</Typography>
            <Typography variant="body-sm" className="mt-1">
              Theme: {mounted ? theme : "—"}
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Typography variant="body-sm">
              {mounted ? (theme === "light" ? "Light" : "Dark") : "—"}
            </Typography>
            <Toggle
              checked={mounted ? theme === "dark" : false}
              onClick={toggleTheme}
              label="Toggle theme"
            />
          </div>
        </div>

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="space-y-3">
            <Typography variant="h1">Heading 1 — Page titles</Typography>
            <Typography variant="h2">Heading 2 — Section headers</Typography>
            <Typography variant="h3">Heading 3 — Card titles</Typography>
            <Typography variant="h4">Heading 4 — Subsections</Typography>
            <Typography variant="body">
              Body — Regular paragraph text for descriptions and content blocks.
            </Typography>
            <Typography variant="body-sm">
              Body Small — Secondary text, helper text, table cells.
            </Typography>
            <Typography variant="caption">
              Caption — timestamps, labels, metadata
            </Typography>
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Button">
          <div className="space-y-6">
            <div>
              <Typography variant="body-sm" className="mb-3">
                Variants
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div>
              <Typography variant="body-sm" className="mb-3">
                Sizes
              </Typography>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <Typography variant="body-sm" className="mb-3">
                States
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badge">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </Section>

        {/* ── Card ── */}
        <Section title="Card">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Typography variant="h4">Revenue</Typography>
                  <Badge variant="success">+12.5%</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Typography variant="h2">$48,352</Typography>
                <Typography variant="body-sm" className="mt-1">
                  vs $42,980 last month
                </Typography>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Typography variant="h4">Active Users</Typography>
                  <Badge variant="warning">-2.1%</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Typography variant="h2">1,247</Typography>
                <Typography variant="body-sm" className="mt-1">
                  vs 1,274 last month
                </Typography>
              </Card.Body>
            </Card>

            <Card className="sm:col-span-2">
              <Card.Body>
                <Typography variant="h4">Simple Card</Typography>
                <Typography variant="body" className="mt-2">
                  A card without a header — just body content. Useful for
                  content blocks that don&apos;t need a title/action row.
                </Typography>
              </Card.Body>
            </Card>
          </div>
        </Section>

        {/* ── Input ── */}
        <Section title="Input">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="Email"
              placeholder="you@company.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
            />
            <Input
              label="With Error"
              error="This field is required"
              defaultValue="bad-value"
            />
            <Input
              label="Disabled"
              disabled
              defaultValue="Cannot edit"
            />
          </div>
        </Section>

        {/* ── Toggle ── */}
        <Section title="Toggle">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <Toggle
                checked={toggleState}
                onClick={() => setToggleState((prev) => !prev)}
                label="Demo toggle"
              />
              <Typography variant="body-sm">
                {toggleState ? "On" : "Off"}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <Toggle checked disabled label="Disabled on" />
              <Typography variant="body-sm">Disabled (on)</Typography>
            </div>
            <div className="flex items-center gap-3">
              <Toggle disabled label="Disabled off" />
              <Typography variant="body-sm">Disabled (off)</Typography>
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}

/**
 * Section wrapper — keeps showcase layout consistent.
 * Local to this page, not a shared component.
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <Typography variant="h3">{title}</Typography>
        <div className="h-px flex-1 bg-border-default" />
      </div>
      {children}
    </section>
  );
}
