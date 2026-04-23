/**
 * Mock billing state — user's subscription to OUR SaaS.
 * In Pass 2 this data comes from Stripe via webhooks into our DB.
 */

export interface UsageMetric {
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

export interface CurrentPlan {
  name: string;
  slug: "Pro"; // would be a union in real code
  priceMonthly: number;
  cycle: "monthly" | "annual";
  nextBillDate: string;
  renewsOn: string;
  usage: UsageMetric[];
}

export const currentPlan: CurrentPlan = {
  name: "Professional",
  slug: "Pro",
  priceMonthly: 99,
  cycle: "monthly",
  nextBillDate: "2026-04-30",
  renewsOn: "Apr 30, 2026",
  usage: [
    { label: "Events tracked", used: 8400, limit: 10000 },
    { label: "Team seats", used: 6, limit: 10 },
    { label: "Storage", used: 2.1, limit: 10, unit: "GB" },
  ],
};

export interface PaymentMethod {
  brand: "Visa" | "Mastercard" | "Amex";
  last4: string;
  expMonth: number;
  expYear: number;
}

export const paymentMethod: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expMonth: 4,
  expYear: 2028,
};

export type InvoiceStatus = "paid" | "failed" | "upcoming";

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

export const mockInvoices: Invoice[] = [
  { id: "inv-1", number: "INV-2026-004", date: "2026-04-01", amount: 99, status: "paid" },
  { id: "inv-2", number: "INV-2026-003", date: "2026-03-01", amount: 99, status: "paid" },
  { id: "inv-3", number: "INV-2026-002", date: "2026-02-01", amount: 99, status: "paid" },
  { id: "inv-4", number: "INV-2026-001", date: "2026-01-01", amount: 99, status: "paid" },
  { id: "inv-5", number: "INV-2025-012", date: "2025-12-01", amount: 99, status: "paid" },
  { id: "inv-6", number: "INV-2025-011", date: "2025-11-01", amount: 99, status: "paid" },
];
