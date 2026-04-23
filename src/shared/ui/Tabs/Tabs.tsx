"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

/**
 * Tabs — Radix-powered tabs with project styling.
 *
 * WHY Radix:
 * Keyboard navigation (arrow keys across tabs), focus management, and
 * ARIA (`role="tablist"`, `aria-selected`, `aria-controls`) are all
 * handled correctly out of the box. Rolling this by hand always ends
 * in subtle a11y bugs.
 *
 * WHY a thin pass-through API (not re-exporting all Radix parts):
 * We expose only `Tabs.Root / Tabs.List / Tabs.Trigger / Tabs.Content`
 * named to match the underlying Radix names. Keeps the learning curve
 * short and future Radix features (e.g. orientation) reachable via
 * the same components.
 *
 * WHY the trigger uses `data-[state=active]` styling:
 * Radix sets data-state on the trigger when selected. CSS `data-[...]`
 * variant picks it up without writing any JS — the active styling is
 * fully declarative.
 */

interface TabsRootProps extends RadixTabs.TabsProps {
  children: ReactNode;
}

function Root({ children, ...props }: TabsRootProps) {
  return <RadixTabs.Root {...props}>{children}</RadixTabs.Root>;
}

interface TabsListProps extends RadixTabs.TabsListProps {
  children: ReactNode;
  className?: string;
}

function List({ children, className = "", ...props }: TabsListProps) {
  return (
    <RadixTabs.List
      className={`
        inline-flex items-center gap-1
        rounded-lg border border-border-default bg-bg-surface p-1
        ${className}
      `}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
}

interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {
  children: ReactNode;
  className?: string;
}

function Trigger({ children, className = "", ...props }: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={`
        inline-flex items-center gap-2
        rounded-md px-3 py-1.5 text-sm font-medium
        text-text-secondary
        transition-colors
        hover:text-text-primary
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-border-focus
        data-[state=active]:bg-bg-muted
        data-[state=active]:text-text-primary
        data-[state=active]:shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

interface TabsContentProps extends RadixTabs.TabsContentProps {
  children: ReactNode;
  className?: string;
}

function Content({ children, className = "", ...props }: TabsContentProps) {
  return (
    <RadixTabs.Content
      className={`
        focus-visible:outline-none
        ${className}
      `}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
}

export const Tabs = { Root, List, Trigger, Content };
