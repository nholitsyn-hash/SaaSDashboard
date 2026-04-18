import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      title="Analytics"
      description="Deep-dive metrics — cohorts, retention curves, LTV, and custom breakdowns."
      icon={BarChart3}
    />
  );
}
