import { Typography } from "@/shared/ui";
import { BillingOverview } from "@/widgets/billing-overview";

export default function AdminBillingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Billing</Typography>
          <Typography variant="body-sm">
            Your subscription, payment method, and invoice history. Card entry
            and plan changes live in the Stripe Customer Portal.
          </Typography>
        </header>

        <BillingOverview />
      </div>
    </div>
  );
}
