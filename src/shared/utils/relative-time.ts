/**
 * Format an ISO date string as a human-friendly "Active now / 12 min ago"
 * label.
 *
 * WHY a hand-rolled thresholds (not Intl.RelativeTimeFormat):
 *   `Intl.RelativeTimeFormat` requires you to pick a unit ("hour", "day")
 *   ahead of time. We want custom granularity — "Active now" under 5
 *   minutes, then minutes, then hours, then "Yesterday", then days, then
 *   weeks, then months. Cleaner to express the rules explicitly.
 *
 * Returns "Never" for null input (unseen accounts).
 */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 5) return "Active now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
