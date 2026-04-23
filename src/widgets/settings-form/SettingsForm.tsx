"use client";

import { useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import {
  Bell,
  KeyRound,
  Lock,
  Palette,
  Sparkles,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Toggle } from "@/shared/ui";
import { useThemeStore } from "@/shared/store/theme";
import type { Theme } from "@/shared/types/theme";

/**
 * SettingsForm — tabbed settings panel.
 *
 * WHY Radix Tabs directly (not our project `Tabs` wrapper):
 * Our `Tabs` wrapper styles horizontal bars — tight spacing and
 * `items-center`. The Settings page wants a vertical rail on desktop
 * that flips horizontal on mobile, with stretched trigger widths. Easier
 * to drop down one level to Radix primitives here than fork the wrapper.
 *
 * WHY every Save button fires a toast:
 * Pass 1 is visual — no writes. Toast ("Profile saved") gives the user
 * feedback that the interaction fired, with honest subtext so they know
 * it's demo-grade.
 */

interface SettingsSection {
  value: string;
  label: string;
  icon: LucideIcon;
}

const sections: SettingsSection[] = [
  { value: "profile", label: "Profile", icon: User },
  { value: "password", label: "Password & 2FA", icon: Lock },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "api", label: "API keys", icon: KeyRound },
];

export function SettingsForm() {
  return (
    <RadixTabs.Root
      defaultValue="profile"
      orientation="vertical"
      className="flex flex-col lg:flex-row gap-6"
    >
      <RadixTabs.List
        aria-label="Settings sections"
        className="
          flex flex-row lg:flex-col gap-1
          overflow-x-auto lg:overflow-x-visible
          lg:w-56 shrink-0
          -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0
        "
      >
        {sections.map((s) => (
          <SectionTrigger key={s.value} section={s} />
        ))}
      </RadixTabs.List>

      <div className="flex-1 min-w-0">
        <RadixTabs.Content value="profile">
          <ProfileSection />
        </RadixTabs.Content>
        <RadixTabs.Content value="password">
          <PasswordSection />
        </RadixTabs.Content>
        <RadixTabs.Content value="notifications">
          <NotificationsSection />
        </RadixTabs.Content>
        <RadixTabs.Content value="appearance">
          <AppearanceSection />
        </RadixTabs.Content>
        <RadixTabs.Content value="api">
          <ApiKeysSection />
        </RadixTabs.Content>
      </div>
    </RadixTabs.Root>
  );
}

function SectionTrigger({ section }: { section: SettingsSection }) {
  const Icon = section.icon;
  return (
    <RadixTabs.Trigger
      value={section.value}
      className="
        inline-flex items-center gap-2 shrink-0
        rounded-lg px-3 py-2 text-sm font-medium
        text-text-secondary transition-colors
        hover:bg-bg-muted hover:text-text-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        data-[state=active]:bg-primary-subtle
        data-[state=active]:text-primary-text
        lg:justify-start
      "
    >
      <Icon size={16} />
      {section.label}
    </RadixTabs.Trigger>
  );
}

/* ──────────────────────── Section: shared shell ──────────────────────── */

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-surface shadow-sm">
      <div className="border-b border-border-default px-6 py-4">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <p className="mt-0.5 text-xs text-text-tertiary">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ────────────────────────────── Profile ────────────────────────────── */

function ProfileSection() {
  const [name, setName] = useState("Nikita Golitsyn");
  const [email, setEmail] = useState("nikita@acme.co");
  const [timezone, setTimezone] = useState("America/New_York");

  return (
    <SectionShell
      title="Profile"
      description="Your identity inside this workspace."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Profile saved");
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Input
          label="Timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          placeholder="IANA zone name (e.g. Europe/London)"
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </SectionShell>
  );
}

/* ────────────────────────────── Password ────────────────────────────── */

function PasswordSection() {
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <SectionShell
        title="Change password"
        description="Pick a strong passphrase of at least 12 characters."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Password updated");
          }}
          className="flex flex-col gap-4"
        >
          <Input label="Current password" type="password" autoComplete="current-password" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="New password" type="password" autoComplete="new-password" />
            <Input label="Confirm new password" type="password" autoComplete="new-password" />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </SectionShell>

      <SectionShell
        title="Two-factor authentication"
        description="Require a second factor when signing in."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-text-primary">
              Authenticator app
            </span>
            <span className="text-xs text-text-tertiary">
              {twoFa ? "Enabled · Authy" : "Disabled"}
            </span>
          </div>
          <Toggle
            checked={twoFa}
            onClick={() => {
              setTwoFa((v) => !v);
              toast.success(twoFa ? "2FA disabled" : "2FA enabled");
            }}
            label="Two-factor authentication"
          />
        </div>
      </SectionShell>
    </div>
  );
}

/* ─────────────────────────── Notifications ─────────────────────────── */

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

const notificationPrefs: NotificationPref[] = [
  { id: "new-signup", label: "New signups", description: "Daily digest of pending signups requiring review.", defaultOn: true },
  { id: "churn", label: "Churn events", description: "Alert when a paying customer cancels or downgrades.", defaultOn: true },
  { id: "weekly", label: "Weekly summary", description: "Every Monday — MRR, churn, and top-performing reports.", defaultOn: true },
  { id: "mentions", label: "Mentions", description: "When a teammate @-mentions you in a shared report.", defaultOn: false },
  { id: "marketing", label: "Product updates", description: "New features, integrations, and changelog entries.", defaultOn: false },
];

function NotificationsSection() {
  return (
    <SectionShell
      title="Email notifications"
      description="Choose which emails land in your inbox."
    >
      <div className="flex flex-col divide-y divide-border-subtle">
        {notificationPrefs.map((pref) => (
          <NotificationRow key={pref.id} pref={pref} />
        ))}
      </div>
    </SectionShell>
  );
}

function NotificationRow({ pref }: { pref: NotificationPref }) {
  const [enabled, setEnabled] = useState(pref.defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-text-primary">
          {pref.label}
        </span>
        <span className="text-xs text-text-tertiary">{pref.description}</span>
      </div>
      <Toggle
        checked={enabled}
        onClick={() => {
          setEnabled((v) => !v);
          toast.success(
            enabled ? `${pref.label} — muted` : `${pref.label} — enabled`
          );
        }}
        label={pref.label}
      />
    </div>
  );
}

/* ───────────────────────────── Appearance ───────────────────────────── */

function AppearanceSection() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const options: { value: Theme; label: string; description: string }[] = [
    { value: "light", label: "Light", description: "Default bright surfaces." },
    { value: "dark", label: "Dark", description: "Low-light interface." },
  ];

  return (
    <SectionShell
      title="Appearance"
      description="Choose how the dashboard looks on this device."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`
                flex flex-col items-start gap-1 rounded-lg border p-4 text-left
                transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                ${
                  active
                    ? "border-primary bg-primary-subtle"
                    : "border-border-default bg-bg-surface hover:bg-bg-muted"
                }
              `}
            >
              <span
                className={`text-sm font-semibold ${active ? "text-primary-text" : "text-text-primary"}`}
              >
                {opt.label}
              </span>
              <span className="text-xs text-text-secondary">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ───────────────────────────── API keys ───────────────────────────── */

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
}

const mockApiKeys: ApiKey[] = [
  { id: "k-1", name: "Production", prefix: "sk_live_Nc2B…4k7L", createdAt: "2025-09-12", lastUsed: "2 hours ago" },
  { id: "k-2", name: "Staging", prefix: "sk_test_9QHr…2wYp", createdAt: "2026-02-04", lastUsed: "yesterday" },
];

function ApiKeysSection() {
  return (
    <SectionShell
      title="API keys"
      description="Machine credentials for the SaaS Analytics REST API."
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-end">
          <Button
            onClick={() =>
              toast.success("New key created", {
                description: "Real flow opens a modal with the one-time secret",
              })
            }
          >
            <Sparkles size={14} />
            Create key
          </Button>
        </div>
        <ul className="flex flex-col divide-y divide-border-subtle border border-border-default rounded-lg">
          {mockApiKeys.map((k) => (
            <ApiKeyRow key={k.id} apiKey={k} />
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}

function ApiKeyRow({ apiKey }: { apiKey: ApiKey }) {
  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-text-primary">
          {apiKey.name}
        </span>
        <span className="text-xs font-mono text-text-tertiary">
          {apiKey.prefix}
        </span>
        <span className="text-[11px] text-text-muted">
          Created {apiKey.createdAt} · Last used {apiKey.lastUsed}
        </span>
      </div>
      <button
        type="button"
        onClick={() =>
          toast.error(`Revoke ${apiKey.name}?`, {
            description: "Action requires confirmation in production",
          })
        }
        aria-label={`Revoke ${apiKey.name}`}
        className="
          inline-flex items-center gap-1.5
          rounded-md border border-danger-subtle bg-danger-subtle
          px-2.5 py-1 text-xs font-medium text-danger-text
          transition-colors hover:bg-danger hover:text-on-danger hover:border-danger
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
        "
      >
        <Trash2 size={12} />
        Revoke
      </button>
    </li>
  );
}
