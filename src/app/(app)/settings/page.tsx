import { Typography } from "@/shared/ui";
import { SettingsForm } from "@/widgets/settings-form";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Settings</Typography>
          <Typography variant="body-sm">
            Profile, security, notifications, appearance, and API keys
          </Typography>
        </header>

        <SettingsForm />
      </div>
    </div>
  );
}
