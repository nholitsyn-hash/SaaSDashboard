import { Typography } from "@/shared/ui";
import { SignupsQueue } from "@/widgets/signups-queue";

export default function SignupsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-1">
          <Typography variant="h2">Signups</Typography>
          <Typography variant="body-sm">
            Review pending signups and approve or reject each request
          </Typography>
        </header>

        <SignupsQueue />
      </div>
    </div>
  );
}
