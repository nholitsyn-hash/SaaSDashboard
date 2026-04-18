import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/shared/ui";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="Settings"
      description="Profile, preferences, security, and notification settings."
      icon={Settings}
    />
  );
}
