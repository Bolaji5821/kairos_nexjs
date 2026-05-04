import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import CompetitionBasicsForm from "./CompetitionBasicsForm";
import TimelineForm from "./TimelineForm";
import RewardsForm from "./RewardsForm";
import SubmissionDeadlinesForm from "./SubmissionDeadlinesForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  postCompetition,
  updateCompetition,
  getOwnerCompetitionById,
} from "@/services/competitionService";
import { toast } from "sonner";

type Props = {};

const postNewCompetitionSchema = z.object({
  title: z.string().min(1, "Please type the competition title"),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  coverImage: z
    .array(z.instanceof(File))
    .or(z.instanceof(FileList))
    .or(z.any())
    .optional(),
  prize: z.string().optional(),
  prizeAmount: z.string().optional(),
  whatToSubmit: z.string().optional(),
  externalApplyLink: z.string().optional(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  applicationDeadline: z.date().optional(),
});

export default function PostNewCompetition({}: Props) {
  const STEPS = {
    "Competition Basics": 1,
    Timeline: 2,
    Rewards: 3,
    "Submission Details": 4,
  };

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const competitionId = searchParams.get("competitionId");
  const isEditing = !!competitionId;

  // Track draft competition ID for new competitions that get created as drafts
  const [draftCompetitionId, setDraftCompetitionId] = useState<string | null>(
    null,
  );

  const stepLabels = Object.keys(STEPS);

  const [step, setStep] = useState(1);

  // Define which fields belong to each step
  const stepFields = {
    1: ["title", "shortDescription", "description", "coverImage"] as const,
    2: ["startsAt", "endsAt", "applicationDeadline"] as const,
    3: ["prize", "prizeAmount"] as const,
    4: ["whatToSubmit", "externalApplyLink"] as const,
  };

  // Dynamically generate step schemas from the main schema
  const createStepSchema = (stepNumber: keyof typeof stepFields) => {
    const fields = stepFields[stepNumber];
    const stepShape = Object.fromEntries(
      fields.map((field) => [field, postNewCompetitionSchema.shape[field]]),
    );
    return z.object(stepShape);
  };

  // Get step schemas dynamically
  const getStepSchema = (stepNumber: number) => {
    return createStepSchema(stepNumber as keyof typeof stepFields);
  };

  type PostNewCompetitionFormType = z.infer<typeof postNewCompetitionSchema>;

  // Save as draft - this will submit the competition with DRAFT status
  const saveAsDraft = async () => {
    try {
      // Get current form data and submit with DRAFT status
      // No validation required for drafts - save at any point
      const formData = form.getValues();
      await onSubmit(formData, "DRAFT");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Error saving draft");
    }
  };

  // Function to validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepSchema = getStepSchema(step);
    if (!currentStepSchema) return true;

    const fieldsToValidate = stepFields[step as keyof typeof stepFields];
    const result = await form.trigger(fieldsToValidate as any);

    if (!result) {
      toast.error("Please fix the errors before proceeding to the next step");
      return false;
    }

    return true;
  };

  const form = useForm<PostNewCompetitionFormType>({
    resolver: zodResolver(postNewCompetitionSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      coverImage: [],
      prize: "",
      prizeAmount: "",
      whatToSubmit: "",
      externalApplyLink: "",
      startsAt: undefined, // Empty string for string-based date fields
      endsAt: undefined,
      applicationDeadline: undefined,
    },
  });

  // Fetch existing competition data if editing
  const { data: existingCompetition } = useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => getOwnerCompetitionById(competitionId!),
    enabled: !!competitionId,
  });

  // Load existing competition data into form when editing
  useEffect(() => {
    if (existingCompetition?.data && isEditing) {
      const competitionData = existingCompetition.data;

      console.log("Loaded competition data:", competitionData);

      // Transform the data to match form structure
      const formData: PostNewCompetitionFormType = {
        title: competitionData.title || "",
        shortDescription: competitionData.shortDescription || "",
        description: competitionData.description || "",
        coverImage: [],
        prize: competitionData.prize || "",
        prizeAmount: competitionData.prizeAmount || "",
        whatToSubmit: competitionData.whatToSubmit || "",
        externalApplyLink: competitionData.externalApplyLink || "",
        startsAt: competitionData.startsAt
          ? new Date(competitionData.startsAt)
          : undefined,
        endsAt: competitionData.endsAt
          ? new Date(competitionData.endsAt)
          : undefined,
        applicationDeadline: competitionData.applicationDeadline
          ? new Date(competitionData.applicationDeadline)
          : undefined,
      };

      form.reset(formData);
      toast.success("Competition data loaded successfully!");
    }
  }, [competitionId, existingCompetition, isEditing, form]);

  const nextStep = async () => {
    // Validate current step before proceeding
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    try {
      // Submit as DRAFT when moving to next step
      const formData = form.getValues();
      await onSubmit(formData, "DRAFT");

      // Only move to next step if submission was successful
      if (step < stepLabels.length) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error("Error submitting draft:", error);
      // Don't move to next step if submission failed
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variables: {
      data: FormData;
      isEditing: boolean;
      competitionId?: string;
      status: "DRAFT" | "PUBLISHED";
    }) => {
      // Determine which ID to use: existing competitionId from URL or newly created draftCompetitionId
      const effectiveCompetitionId =
        variables.competitionId || draftCompetitionId;

      if (variables.isEditing || effectiveCompetitionId) {
        return updateCompetition(variables.data);
      } else {
        return postCompetition(variables.data);
      }
    },
    mutationKey: ["postCompetition"],
    onSuccess: (response, variables) => {
      // Handle the response structure for new competition creation
      if (!variables.isEditing && !draftCompetitionId && response?.data) {
        // This is the first submission (creating a draft), store the competition ID
        setDraftCompetitionId(response.data);
      }

      if (variables.status === "DRAFT") {
        toast.success(
          variables.isEditing || draftCompetitionId
            ? "Competition draft updated successfully!"
            : "Competition saved as draft!",
        );
      } else {
        toast.success(
          variables.isEditing || draftCompetitionId
            ? "Competition updated successfully!"
            : "Competition published successfully!",
        );
        // Reset form and navigate for published competitions
        form.reset();
        navigate("/competitions");
      }

      // Invalidate competitions queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-competitions"],
      });
    },
    onError: (error: any) => {
      console.error("Error posting/updating competition:", error);

      // Extract error message from the backend response
      let errorMessage =
        isEditing || draftCompetitionId
          ? "Failed to update competition. Please try again."
          : "Failed to post competition. Please try again.";

      // Check for specific error message in different possible locations
      if (error?.message) {
        errorMessage = error.message;
      } else if (error.error.response) {
        errorMessage = error.error.response.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }

      toast.error(errorMessage);
    },
  });

  // Function to submit competition and return a promise
  const submitCompetition = async (
    data: PostNewCompetitionFormType,
    status: "DRAFT" | "PUBLISHED" = "PUBLISHED",
  ): Promise<void> => {
    try {
      // Only validate for PUBLISHED status, not for DRAFT
      if (status === "PUBLISHED") {
        const isValid = await form.trigger();
        if (!isValid) {
          toast.error("Please fix all errors before submitting");
          throw new Error("Validation failed");
        }

        // Check if we're on the last step before submitting
        if (step !== stepLabels.length) {
          toast.error("Please complete all steps before submitting");
          throw new Error("Not on last step");
        }
      }

      // Create FormData for submission - include empty fields
      const submissionData = new FormData();

      // Add competition ID if editing or we have a draft ID
      const effectiveId = competitionId || draftCompetitionId;
      if (effectiveId) {
        submissionData.append("id", effectiveId);
      }

      Object.entries(data).forEach(([key, value]) => {
        if (key === "coverImage") {
          if (Array.isArray(value) && value.length > 0) {
            submissionData.append(key, value[0]);
          }
          // Note: For files, we don't send empty values as they would be meaningless
        } else if (value instanceof Date) {
          submissionData.append(key, value.toISOString());
        } else if (Array.isArray(value)) {
          // Handle array fields (if any exist in the schema)
          if (value.length > 0) {
            value.forEach((item) => {
              submissionData.append(key, item);
            });
          } else {
            // Send empty field to indicate intentionally cleared array
            submissionData.append(key, "");
          }
        } else {
          // Handle scalar fields - include empty strings to capture intentionally empty fields
          const stringValue =
            value !== null && value !== undefined ? String(value) : "";
          submissionData.append(key, stringValue);
        }
      });

      // Add status to the submission data
      submissionData.append("status", status);

      // Log what we're sending for debugging
      console.log("Competition form data being sent:");
      for (const [key, value] of submissionData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await mutateAsync({
        data: submissionData,
        isEditing: !!competitionId || !!draftCompetitionId,
        status,
      });

      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-competitions"],
      });

      // Store the competition ID for subsequent updates
      if (!isEditing && !draftCompetitionId && response?.data?.competitionId) {
        setDraftCompetitionId(response.data.competitionId);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error; // Re-throw to allow caller to handle
    }
  };

  const onSubmit = async (
    data: PostNewCompetitionFormType,
    status: "DRAFT" | "PUBLISHED" = "PUBLISHED",
  ) => {
    return submitCompetition(data, status);
  };

  // Wrapper for form submission with PUBLISHED status
  const handlePublishCompetition = async (data: PostNewCompetitionFormType) => {
    await onSubmit(data, "PUBLISHED");
  };

  return (
    <div>
      <Link
        to="/competitions"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      <div className="block space-y-5 lg:space-y-0 lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-5">
        <div className="w-full h-fit p-3 md:p-4 lg:p-6 rounded-lg bg-white shadow-md lg:col-span-2">
          <h1 className="text-xl font-semibold">
            {isEditing ? "Edit Competition" : "Post New Competition"}
          </h1>
          <p className="text-gray-600 text-sm mt-2 mb-4">
            {isEditing
              ? "Update your competition details"
              : "Following steps to post new competition"}
          </p>
          <div className="space-y-6">
            {stepLabels.map((label) => {
              const stepIndex = STEPS[label as keyof typeof STEPS];
              const isActiveOrCompleted = step >= stepIndex;
              const isCurrentStep = step === stepIndex;

              return (
                <div key={label} className="flex items-start gap-3 mb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isActiveOrCompleted
                          ? "border-custom-magenta-500 bg-custom-magenta-500 text-white"
                          : "border-gray-300"
                      } ${isCurrentStep ? "ring-2 ring-custom-magenta-200" : ""}`}
                    >
                      {step > stepIndex && (
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {isCurrentStep && step === stepIndex && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    {stepIndex < stepLabels.length && (
                      <div
                        className={`w-2 h-10 ${
                          step > stepIndex
                            ? "bg-custom-magenta-500"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isActiveOrCompleted
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    } ${isCurrentStep ? "text-custom-magenta-500" : ""}`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="ghost"
              className="text-custom-magenta-500 underline py-0 h-fit hover:text-custom-magenta-500 p-2"
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              variant="ghost"
              className="text-custom-magenta-500 underline py-0 h-fit hover:text-custom-magenta-500 p-2"
              onClick={nextStep}
              disabled={step >= stepLabels.length}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="flex-1 border p-3 md:p-4 lg:p-6 rounded-lg bg-white lg:col-start-3 lg:col-span-4">
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Never auto-submit, only through button click
              }}
            >
              {step === STEPS["Competition Basics"] && (
                <CompetitionBasicsForm
                  existingCoverImageUrl={existingCompetition?.data.coverImage}
                  form={form}
                />
              )}
              {step === STEPS.Timeline && <TimelineForm form={form} />}
              {step === STEPS.Rewards && <RewardsForm form={form} />}
              {step === STEPS["Submission Details"] && (
                <SubmissionDeadlinesForm form={form} />
              )}

              <div className="mt-10 flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={saveAsDraft}
                  className="px-4 h-10 rounded"
                  disabled={isPending}
                >
                  {isEditing ? "Save Changes" : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  onClick={
                    step === stepLabels.length
                      ? () => {
                          form.handleSubmit(handlePublishCompetition)();
                        }
                      : nextStep
                  }
                  className="px-4 h-10 rounded disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending
                    ? isEditing
                      ? "Updating..."
                      : "Publishing..."
                    : step === stepLabels.length
                      ? isEditing
                        ? "Update Competition"
                        : "Publish Competition"
                      : "Save and Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
