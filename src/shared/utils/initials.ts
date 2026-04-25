/**
 * Derive 1–2 letter initials from a name (preferred) or email (fallback).
 *
 * - "Sarah Whitfield" → "SW"
 * - "Nikita"          → "N"
 * - undefined + "olivia@x.io" → "O"
 * - undefined + undefined → "?"
 *
 * Used by the topbar avatar, sidebar brand monogram, and team list rows.
 * Centralized so the same display logic isn't re-derived in three places.
 */
export function initialsFrom(
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
