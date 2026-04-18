import { Users } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function CustomersPage() {
  return (
    <PagePlaceholder
      title="Customers"
      description="Searchable directory of every customer account and their lifecycle state."
      icon={Users}
    />
  );
}
