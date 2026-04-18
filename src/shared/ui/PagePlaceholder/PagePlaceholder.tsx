import type { LucideIcon } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
}

/**
 * PagePlaceholder — shared "coming soon" stub for routes that exist in nav
 * but aren't built yet. Keeping one component means all placeholders look
 * identical and a future phase can evolve them in one place.
 */
export function PagePlaceholder({
  title,
  description,
  icon: Icon,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div
          aria-hidden
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary-text"
        >
          <Icon size={24} />
        </div>
        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        )}
        <span className="mt-4 inline-flex items-center rounded-full bg-bg-muted px-3 py-1 text-xs font-medium text-text-tertiary">
          Coming in a later phase
        </span>
      </div>
    </div>
  );
}
