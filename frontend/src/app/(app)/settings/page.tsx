import { SettingsForm } from "./SettingsForm";
import { UpdateAvatar } from "./UpdateAvatar";

export default function SettingsPage() {
  return (
    <div className="flex-1 px-4 py-6 font-lato">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Update your personal info
          </p>
        </div>

        <SettingsForm />
        <UpdateAvatar />
      </div>
    </div>
  );
}
