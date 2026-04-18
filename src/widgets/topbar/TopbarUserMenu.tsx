"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut, Settings as SettingsIcon } from "lucide-react";
import type { Role } from "@/shared/types/auth";

interface TopbarUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: Role;
  };
}

/**
 * TopbarUserMenu — avatar + dropdown with identity, settings, sign-out.
 *
 * WHY client-side signOut from next-auth/react (not the server export):
 * Our `shared/api/auth.ts` exports signOut as a server action; calling it
 * from a DropdownMenu.Item (client) would need a <form action={signOut}>.
 * next-auth/react's signOut triggers the signout flow via fetch + redirect,
 * which fits a menu-item click naturally.
 *
 * WHY initials derived from name/email (not <img>):
 * The session's `image` field is usually empty for credentials-only logins.
 * Deterministic initials in a gradient circle avoid a broken-image state
 * and feel branded. When real avatars land we'll branch on `user.image`.
 */
export function TopbarUserMenu({ user }: TopbarUserMenuProps) {
  const displayName = user.name ?? user.email ?? "Account";
  const initials = initialsFrom(user.name, user.email);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="
            inline-flex items-center gap-2
            rounded-lg border border-border-default bg-bg-surface
            py-1 pl-1 pr-2
            transition-colors
            hover:bg-bg-muted
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-border-focus focus-visible:ring-offset-2
          "
        >
          <Avatar initials={initials} />
          <span className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-xs font-semibold text-text-primary max-w-[120px] truncate">
              {displayName}
            </span>
            <span className="text-[10px] text-text-tertiary uppercase tracking-wide">
              {roleLabel(user.role)}
            </span>
          </span>
          <ChevronDown size={14} className="text-text-tertiary" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="
            z-50 w-60 rounded-xl border border-border-default
            bg-bg-surface-raised shadow-lg
            overflow-hidden
          "
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
            <Avatar initials={initials} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {displayName}
              </p>
              {user.email && (
                <p className="text-xs text-text-tertiary truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <div className="p-1">
            <DropdownMenu.Item asChild>
              <Link
                href="/settings"
                className="
                  flex items-center gap-2 rounded-md px-3 py-2
                  text-sm text-text-secondary cursor-pointer outline-none
                  data-[highlighted]:bg-bg-muted data-[highlighted]:text-text-primary
                "
              >
                <SettingsIcon size={14} />
                Settings
              </Link>
            </DropdownMenu.Item>
          </div>

          <div className="border-t border-border-default p-1">
            <DropdownMenu.Item
              onSelect={() => signOut({ callbackUrl: "/login" })}
              className="
                flex items-center gap-2 rounded-md px-3 py-2
                text-sm text-danger-text cursor-pointer outline-none
                data-[highlighted]:bg-danger-subtle
              "
            >
              <LogOut size={14} />
              Sign out
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      aria-hidden
      className="
        flex h-7 w-7 shrink-0 items-center justify-center rounded-full
        bg-gradient-to-br from-primary to-secondary
        text-[11px] font-bold text-white
      "
    >
      {initials}
    </div>
  );
}

function initialsFrom(
  name?: string | null,
  email?: string | null
): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
    const joined = letters.join("");
    if (joined) return joined;
  }
  if (email) return email[0]?.toUpperCase() ?? "?";
  return "?";
}

function roleLabel(role: Role): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "viewer":
      return "Viewer";
  }
}
