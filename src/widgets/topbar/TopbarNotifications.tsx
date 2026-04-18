"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, CheckCheck, CreditCard, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * TopbarNotifications — bell + badge + dropdown list.
 *
 * WHY Radix Dropdown:
 * Accessible menu semantics, keyboard nav (arrow keys / Escape), focus
 * return to trigger on close. Matches our Dialog choice.
 *
 * WHY placeholder mock items vs empty state:
 * Portfolio demo: an empty bell reads as "feature not wired"; 2-3 sample
 * items read as "designed, wired, populated." Pass 2 replaces the mock
 * array with a real query.
 *
 * WHY unread count on the trigger (not inside the panel):
 * The count is what pulls the user's eye. Putting it inside the panel
 * means you have to open the panel to see you have notifications — the
 * opposite of what a notification indicator should do.
 */

interface MockNotification {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
  unread?: boolean;
}

const mockNotifications: MockNotification[] = [
  {
    id: "1",
    icon: UserPlus,
    title: "New signup — Emma Carter",
    subtitle: "Pro plan, trial started",
    time: "5m ago",
    unread: true,
  },
  {
    id: "2",
    icon: CreditCard,
    title: "Payment received",
    subtitle: "Liam Walsh — $499 Enterprise",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    icon: CheckCheck,
    title: "Weekly report ready",
    subtitle: "Download CSV or share link",
    time: "yesterday",
  },
];

export function TopbarNotifications() {
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
          className="
            relative inline-flex h-9 w-9 items-center justify-center
            rounded-lg border border-border-default bg-bg-surface
            text-text-secondary transition-colors
            hover:bg-bg-muted hover:text-text-primary
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus focus-visible:ring-offset-2
          "
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="
                absolute -top-1 -right-1
                inline-flex min-w-[18px] h-[18px] items-center justify-center
                rounded-full bg-danger px-1
                text-[10px] font-semibold text-white tabular-nums
                ring-2 ring-bg-surface
              "
            >
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="
            z-50 w-80 rounded-xl border border-border-default
            bg-bg-surface-raised shadow-lg
            overflow-hidden
          "
        >
          <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
            <span className="text-sm font-semibold text-text-primary">
              Notifications
            </span>
            <button
              type="button"
              className="
                text-xs font-medium text-primary-text
                hover:underline
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-border-focus rounded
              "
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {mockNotifications.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </ul>
          <div className="border-t border-border-default px-4 py-2">
            <button
              type="button"
              className="w-full text-center text-xs font-medium text-text-secondary hover:text-text-primary"
            >
              View all notifications
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function NotificationRow({ notification }: { notification: MockNotification }) {
  const Icon = notification.icon;
  return (
    <li>
      <DropdownMenu.Item
        className="
          flex items-start gap-3 px-4 py-3 cursor-pointer
          border-b border-border-subtle last:border-0
          outline-none
          data-[highlighted]:bg-bg-muted
        "
      >
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary-text"
        >
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-text-primary truncate">
              {notification.title}
            </p>
            {notification.unread && (
              <span
                aria-label="Unread"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
            )}
          </div>
          <p className="text-xs text-text-tertiary truncate">
            {notification.subtitle}
          </p>
          <p className="mt-0.5 text-[11px] text-text-muted">
            {notification.time}
          </p>
        </div>
      </DropdownMenu.Item>
    </li>
  );
}
