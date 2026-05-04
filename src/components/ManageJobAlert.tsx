import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  subscribeToJobAlert,
  getJobAlerts,
  deleteJobAlert,
} from "@/services/notificationsService";
import { toast } from "sonner";
import { type ManageJobAlertProps } from "@/lib/types";
const jobAlertSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
  isExact: z.boolean(),
});

type JobAlertFormData = z.infer<typeof jobAlertSchema>;

export const ManageJobAlert = ({
  title = "Your Job Alerts",
  description,
  showTitle = true,
  className = "",
  initialKeyword = "",
  showOnlyAddForm = false,
  onSuccess,
}: ManageJobAlertProps) => {
  const [showAddForm, setShowAddForm] = useState(!!initialKeyword);

  const alertForm = useForm<JobAlertFormData>({
    resolver: zodResolver(jobAlertSchema),
    defaultValues: {
      keyword: "",
      isExact: false,
    },
  });


useQuery({
  queryKey: ["initializeJobAlertForm", initialKeyword],
  queryFn: () => {
    if (initialKeyword) {
      alertForm.reset({
        keyword: initialKeyword,
        isExact: false,
      });
      setShowAddForm(true);
    }
    return null;
  },
  enabled: !!initialKeyword,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

  // Fetch existing job alerts
  const {
    data: jobAlertsData,
    refetch: refetchAlerts,
    isLoading: alertsLoading,
  } = useQuery({
    queryKey: ["job-alerts"],
    queryFn: getJobAlerts,
  });

  const jobAlerts = jobAlertsData?.data || [];

  const { mutate: subscribeToAlert, isPending } = useMutation({
    mutationFn: subscribeToJobAlert,
    onSuccess: () => {
      toast.success("Job alert created successfully!");
      alertForm.reset();
      setShowAddForm(false);
      refetchAlerts();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create job alert");
    },
  });

  const { mutate: removeAlert } = useMutation({
    mutationFn: deleteJobAlert,
    onSuccess: () => {
      toast.success("Job alert removed");
      refetchAlerts();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove job alert");
    },
  });

  const handleAddAlert = (data: JobAlertFormData) => {
    subscribeToAlert(data);
  };

  const handleRemoveAlert = (id: string) => {
    removeAlert(id);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Only show header if not in showOnlyAddForm mode */}
      {showTitle && !showOnlyAddForm && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Alert
          </Button>
        </div>
      )}

      {/* Only show existing alerts if not in showOnlyAddForm mode */}
      {!showOnlyAddForm && (
        <div className="space-y-2">
          {alertsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-custom-magenta-500" />
              <span className="ml-2 text-sm text-gray-500">
                Loading job alerts...
              </span>
            </div>
          ) : jobAlerts.length > 0 ? (
            jobAlerts.map((alert: any) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant={alert.isExact ? "default" : "secondary"}>
                    {alert.isExact ? "Exact Match" : "Contains"}
                  </Badge>
                  <span className="font-medium">{alert.keyword}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAlert(alert.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              <p>No job alerts configured yet.</p>
              <p className="text-sm mt-1">
                Add your first alert to get notified about relevant jobs.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Always show the form if in showOnlyAddForm mode, otherwise respect showAddForm state */}
      {(showOnlyAddForm || showAddForm) && (
        <Form {...alertForm}>
          <form
            onSubmit={alertForm.handleSubmit(handleAddAlert)}
            className="space-y-4 p-4 border rounded-lg bg-gray-50"
          >
            {!showOnlyAddForm && (
              <h4 className="font-medium">Add New Job Alert</h4>
            )}

            <FormField
              control={alertForm.control}
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Keyword</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Product Designer, Frontend Developer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={alertForm.control}
              name="isExact"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Exact Match</FormLabel>
                    <div className="text-xs text-muted-foreground">
                      Only notify for exact keyword matches
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Creating..." : "Create Alert"}
              </Button>
              {!showOnlyAddForm && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    alertForm.reset();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
