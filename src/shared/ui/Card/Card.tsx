import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Card — a composable surface container.
 *
 * WHY composable (Card + Card.Header + Card.Body) instead of props:
 * Props like `title` and `subtitle` look simple but become rigid —
 * what if the header needs an icon? A badge? An action button?
 * Composition via slots lets consumers put anything in any section.
 *
 * Usage:
 *   <Card>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *   </Card>
 */
function CardRoot({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-border-default
        bg-bg-surface shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className = "", children, ...props }: CardHeaderProps) {
  return (
    <div
      className={`
        border-b border-border-default px-6 py-4
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

function CardBody({ className = "", children, ...props }: CardBodyProps) {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * WHY Object.assign pattern:
 * This attaches Header and Body as static properties on Card,
 * enabling the Card.Header / Card.Body API without a class.
 * It's the same pattern used by Radix UI and Headless UI.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
