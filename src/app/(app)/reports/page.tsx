import { FileText } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function ReportsPage() {
  return (
    <PagePlaceholder
      title="Reports"
      description="Build custom reports and export to CSV or PDF."
      icon={FileText}
    />
  );
}
