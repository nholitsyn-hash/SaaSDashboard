import { Receipt } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function AdminBillingPage() {
  return (
    <PagePlaceholder
      title="Billing"
      description="Manage your plan, payment method, invoices, and usage."
      icon={Receipt}
    />
  );
}
