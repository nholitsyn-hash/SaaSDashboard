import type { ButtonHTMLAttributes } from "react";

/**
 * Button variants and sizes.
 *
 * WHY string unions instead of an enum:
 * Enums compile to runtime objects — unnecessary JS for what's
 * purely a type-level concern. String unions are erased at compile
 * time and give the same autocomplete.
 */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * WHY a record map instead of if/else or switch:
 * Declarative, exhaustive (TS will error if a variant is missing),
 * and easy to scan visually. Adding a new variant is one line.
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-on-primary hover:bg-primary-hover shadow-sm",
  secondary:
    "bg-secondary text-text-on-secondary hover:bg-secondary-hover shadow-sm",
  outline:
    "border border-border-default bg-transparent text-text-primary hover:bg-bg-muted",
  ghost:
    "bg-transparent text-text-primary hover:bg-bg-muted",
  danger:
    "bg-danger text-text-on-danger hover:bg-danger-hover shadow-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:pointer-events-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
