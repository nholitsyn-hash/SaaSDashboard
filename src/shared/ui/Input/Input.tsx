import { type InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input — text input with optional label and error message.
 *
 * WHY useId() for accessibility:
 * The label's `htmlFor` must match the input's `id` for screen readers.
 * React's useId() generates a stable, SSR-safe unique ID — no need
 * to pass an id prop or use Math.random() (which breaks hydration).
 *
 * WHY aria-describedby for errors:
 * Screen readers announce the error message when the input is focused.
 * aria-invalid tells assistive tech the field has an error state.
 */
export function Input({
  label,
  error,
  className = "",
  id: externalId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full rounded-lg border px-3 py-2
          text-sm text-text-primary
          bg-bg-surface
          placeholder:text-text-muted
          transition-colors duration-150
          ${error
            ? "border-danger focus:outline-none focus:ring-2 focus:ring-danger/25"
            : "border-border-default focus:outline-none focus:ring-2 focus:ring-border-focus/25 focus:border-border-focus"
          }
          ${className}
        `}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger-text">
          {error}
        </p>
      )}
    </div>
  );
}
