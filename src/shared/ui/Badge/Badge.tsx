import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Badge — small label for status indicators, roles, and tags.
 *
 * WHY subtle backgrounds with tinted text:
 * Solid-color badges compete with primary actions for attention.
 * Subtle bg + tinted text is informational without being loud —
 * the same pattern used by GitHub labels and Linear tags.
 */
const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-bg-muted text-text-secondary",
  primary:
    "bg-primary-subtle text-primary-text",
  secondary:
    "bg-secondary-subtle text-secondary-text",
  accent:
    "bg-accent-subtle text-accent-text",
  success:
    "bg-success-subtle text-success-text",
  warning:
    "bg-warning-subtle text-warning-text",
  danger:
    "bg-danger-subtle text-danger-text",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md
        px-2 py-0.5 text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
