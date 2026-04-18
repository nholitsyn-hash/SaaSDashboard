import { Sparkles } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function AiAssistantPage() {
  return (
    <PagePlaceholder
      title="AI Assistant"
      description="Ask questions about your metrics in plain English, powered by Claude."
      icon={Sparkles}
    />
  );
}
