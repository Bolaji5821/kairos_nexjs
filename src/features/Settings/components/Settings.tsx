import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Switch } from "@/components/ui/Switch";
import { useForm } from "react-hook-form";
import { ManageJobAlert } from "@/components/ManageJobAlert";

export default function Settings() {
  const form = useForm({
    defaultValues: {
      jobAlertsEnabled: true,
    },
  });

  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="text-base font-semibold">Profile Settings</p>
        <p className="text-xs text-gray-400">
          Customize your profile preferences and notification settings.
        </p>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        <div>
          <Label className="text-sm font-medium">Job Alerts</Label>
        </div>

        <div className="w-full space-y-6">
          {/* Job Alerts Toggle */}
          <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-5">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Job Alerts</Label>
              <div className="text-xs text-muted-foreground">
                Get notified when new jobs match your keywords
              </div>
            </div>

            <Switch
              checked={form.watch("jobAlertsEnabled")}
              onCheckedChange={(checked) =>
                form.setValue("jobAlertsEnabled", checked)
              }
            />
          </div>

          {/* Job Alerts Management */}
          {form.watch("jobAlertsEnabled") && (
            <ManageJobAlert
              title="Your Job Alerts"
              description="Manage your job alert keywords and preferences"
            />
          )}
        </div>
      </div>
    </div>
  );
}