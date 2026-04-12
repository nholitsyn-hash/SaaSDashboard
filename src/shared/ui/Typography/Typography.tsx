import type { HTMLAttributes, ElementType } from "react";

/**
 * Typography variants map to semantic HTML elements and token-based styles.
 *
 * WHY a component instead of just Tailwind classes:
 * Ensures consistent heading/body styles across the app.
 * If we change h1 sizing, we change it in one place — not grep
 * through every file for "text-4xl font-bold".
 *
 * WHY `as` prop pattern:
 * Sometimes you need h2 visuals with h3 semantics (for accessibility/SEO).
 * The `as` prop lets you decouple visual style from the HTML tag:
 *   <Typography variant="h2" as="h3">
 */

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "body-sm"
  | "caption";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold tracking-tight text-text-primary",
  h2: "text-3xl font-semibold tracking-tight text-text-primary",
  h3: "text-2xl font-semibold text-text-primary",
  h4: "text-xl font-medium text-text-primary",
  body: "text-base text-text-secondary leading-relaxed",
  "body-sm": "text-sm text-text-secondary leading-normal",
  caption: "text-xs text-text-tertiary",
};

/**
 * Default HTML element for each variant.
 * Ensures correct semantics without requiring `as` every time.
 */
const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-sm": "p",
  caption: "span",
};

export function Typography({
  variant = "body",
  as,
  className = "",
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
