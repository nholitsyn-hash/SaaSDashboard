import type { ButtonHTMLAttributes } from "react";

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  label?: string;
}

/**
 * Toggle — a visual switch component (no built-in state).
 *
 * WHY a button, not an input[type="checkbox"]:
 * Checkboxes are for forms that submit data. A toggle is a UI control
 * that triggers an immediate action (like switching themes). Using a
 * <button> with role="switch" is the correct ARIA pattern for this.
 *
 * WHY no internal state:
 * The toggle is controlled — parent passes `checked` and `onClick`.
 * This makes it composable: the theme store controls the state,
 * the toggle just renders it. Same toggle can be reused for
 * notifications, sidebar collapse, etc.
 */
export function Toggle({
  checked = false,
  label,
  className = "",
  ...props
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer
        items-center rounded-full border-2 border-transparent
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-border-focus focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${checked ? "bg-primary" : "bg-bg-subtle"}
        ${className}
      `}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full
          bg-white shadow-sm ring-0 transition-transform duration-200
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}
