import { Typography } from "@/shared/ui";
import {
  SubscriptionsKpis,
  SubscriptionsList,
} from "@/widgets/subscriptions-list";

export default function SubscriptionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Subscriptions</Typography>
          <Typography variant="body-sm">
            Every subscription contract — active, trial, paused, and canceled
          </Typography>
        </header>

        <SubscriptionsKpis />
        <SubscriptionsList />
      </div>
    </div>
  );
}
