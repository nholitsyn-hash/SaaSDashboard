import { Badge, Typography } from "@/shared/ui";
import { AiChat } from "@/widgets/ai-chat";

export default function AiAssistantPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography variant="h2">AI Assistant</Typography>
            <Badge variant="secondary">Soon</Badge>
          </div>
          <Typography variant="body-sm">
            Plain-English answers over your live metrics, powered by Claude
          </Typography>
        </header>

        <AiChat />
      </div>
    </div>
  );
}
