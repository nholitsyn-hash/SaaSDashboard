import { CreditCard } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function SubscriptionsPage() {
  return (
    <PagePlaceholder
      title="Subscriptions"
      description="Active, paused, and cancelled subscriptions with revenue attribution."
      icon={CreditCard}
    />
  );
}
