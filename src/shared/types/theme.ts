/**
 * Theme type definitions
 *
 * WHY a union type and not an enum:
 * Enums in TS compile to runtime objects — extra JS for no benefit here.
 * A union type is erased at compile time, gives identical autocomplete,
 * and works cleanly with Zustand or any other state manager.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "saas-dashboard-theme" as const;

/**
 * WHY a data-attribute strategy:
 * We set data-theme on <html> rather than toggling CSS classes.
 * This works cleanly with our tokens.css [data-theme="dark"] selector
 * and avoids collision with Tailwind's built-in "dark:" variant
 * (which uses prefers-color-scheme or a .dark class).
 */
export const THEME_ATTRIBUTE = "data-theme" as const;
