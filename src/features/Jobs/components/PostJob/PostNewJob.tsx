import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { removeDuplicates } from "@/lib/utils";
import { getUser } from "@/services/authService";
import { getUserJobById, postJob, updateJob } from "@/services/jobsService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import ApplicationSettings from "./ApplicationSettings";
import BasicJobInformation from "./BasicJobInformation";
import CompanyInformation from "./CompanyInformation";
import JobSkills from "./JobSkills";

// Helper function to parse location string "Country, State" format - moved outside component
const parseLocationString = (locationString: string) => {
  if (!locationString || typeof locationString !== "string") {
    return { countryName: "", stateName: "" };
  }

  // Split by comma and trim whitespace
  const parts = locationString.split(",").map((part) => part.trim());

  if (parts.length >= 2) {
    const result = {
      countryName: parts[0] || "",
      stateName: parts[1] || "",
    };
    return result;
  } else if (parts.length === 1) {
    const result = {
      countryName: parts[0] || "",
      stateName: "",
    };
    return result;
  }

  return { countryName: "", stateName: "" };
};

export default function PostNewJob() {
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const STEPS =
    userData?.data?.role === "COMPANY"
      ? {
          "Basic Job Information": 1,
          Skills: 2,
          "Application Settings": 3,
        }
      : {
          "Basic Job Information": 1,
          "Company Information": 2,
          Skills: 3,
          "Application Settings": 4,
        };

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditing = !!jobId;

  // Track draft job ID for new jobs that get created as drafts
  const [draftJobId, setDraftJobId] = useState<string | null>(null);

  // Track if we've already loaded the job data to prevent multiple resets
  const [hasLoadedJobData, setHasLoadedJobData] = useState(false);

  // Track location data for prefilling LocationSelector
  const [locationData, setLocationData] = useState<{
    countryName: string;
    stateName: string;
  }>({
    countryName: "",
    stateName: "",
  });

  const stepLabels = Object.keys(STEPS);

  const [step, setStep] = useState(1);

  // Main schema - single source of truth
  const postNewJobSchema = z.object({
    title: z.string().min(1, "Please type the job title"),
    compensation: z.string().optional(),
    type: z.string().optional(),
    locationType: z.string().optional(),
    experienceLevel: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    location: z.array(z.string()).optional(),
    description: z
      .string()
      .min(1, "Please type the job description")
      .max(100000, "Job description is too long"),
    opportunityUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    companyName: z.string().optional(),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    companyWebsite: z.string().optional(),
    skills: z.array(z.string()).optional(),
    applicationOpenDate: z
      .string()
      .refine(
        (value) => {
          if (!value) return true; // Allow empty values since it's optional
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        { message: "Invalid date format" },
      )
      .optional(),
    applicationCloseDate: z
      .string()
      .refine(
        (value) => {
          if (!value) return true; // Allow empty values since it's optional
          const date = new Date(value);
          return !isNaN(date.getTime());
        },
        { message: "Invalid date format" },
      )
      .optional(),
  });

  // Define which fields belong to each step
  const stepFields =
    userData?.data?.role === "COMPANY"
      ? {
          1: [
            "title",
            "compensation",
            "type",
            "locationType",
            "experienceLevel",
            "yearsOfExperience",
            "location",
            "description",
            "opportunityUrl",
          ] as const,
          2: ["skills"] as const,
          3: ["applicationOpenDate", "applicationCloseDate"] as const,
        }
      : {
          1: [
            "title",
            "compensation",
            "type",
            "locationType",
            "experienceLevel",
            "yearsOfExperience",
            "location",
            "description",
            "opportunityUrl",
          ] as const,
          2: [
            "companyName",
            "industry",
            "companySize",
            "companyWebsite",
          ] as const,
          3: ["skills"] as const,
          4: ["applicationOpenDate", "applicationCloseDate"] as const,
        };

  // Dynamically generate step schemas from the main schema
  const createStepSchema = (stepNumber: keyof typeof stepFields) => {
    const fields = stepFields[stepNumber];
    if (!fields) {
      return z.object({});
    }
    const stepShape = Object.fromEntries(
      fields.map((field) => [field, postNewJobSchema.shape[field]]),
    );
    return z.object(stepShape);
  };

  // Get step schemas dynamically
  const getStepSchema = (stepNumber: number) => {
    return createStepSchema(stepNumber as keyof typeof stepFields);
  };

  type PostNewJobFormType = z.infer<typeof postNewJobSchema>;

  // Function to validate current step
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepSchema = getStepSchema(step);
    if (!currentStepSchema) return true;

    const fieldsToValidate = stepFields[step as keyof typeof stepFields];
    if (!fieldsToValidate) return true;

    const result = await form.trigger(fieldsToValidate as any);

    if (!result) {
      toast.error("Please fix the errors before proceeding to the next step");
      return false;
    }

    return true;
  };

  // Save as draft - this will submit the job with DRAFT status
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

  const { data: existingJob, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getUserJobById(jobId!),
    enabled: !!jobId,
  });

  const form = useForm<PostNewJobFormType>({
    resolver: zodResolver(postNewJobSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      compensation: "",
      type: "",
      locationType: "",
      yearsOfExperience: "",
      experienceLevel: "",
      location: [],
      description: "",
      opportunityUrl: "",
      companyName: userData?.data?.companyName || "",
      industry: userData?.data?.industry || "",
      companySize: userData?.data?.companySize || "",
      companyWebsite: userData?.data?.companyWebsite || "",
      skills: [],
      applicationOpenDate: "",
      applicationCloseDate: "",
    },
  });

  // Fetch existing job data if editing

  // Load existing job data into form when editing
  useEffect(() => {
    if (existingJob?.data && isEditing && !hasLoadedJobData) {
      const jobData = existingJob.data.data;

      // Parse location string to extract country and state
      const parsedLocation = parseLocationString(jobData.location || "");
      setLocationData(parsedLocation);

      // For COMPANY users, always use their company details
      // For others, use job data
      const companyInfo =
        userData?.data?.role === "COMPANY"
          ? {
              companyName: userData.data.companyName || "",
              industry: userData.data.industry || "",
              companySize: userData.data.companySize || "",
              companyWebsite: userData.data.companyWebsite || "",
            }
          : {
              companyName: jobData.companyName || "",
              industry: jobData.industry || "",
              companySize: jobData.companySize || "",
              companyWebsite: jobData.companyWebsite || "",
            };

      // Transform the data to match form structure
      const formData: PostNewJobFormType = {
        title: jobData.title || "",
        compensation: jobData.compensation || "",
        type: jobData.type || "",
        locationType: jobData.locationType || "",
        experienceLevel: jobData.experienceLevel || "",
        yearsOfExperience: jobData.yearsOfExperience?.toString() || "",
        location:
          parsedLocation.countryName && parsedLocation.stateName
            ? [parsedLocation.countryName, parsedLocation.stateName]
            : jobData.location
              ? [jobData.location]
              : [],
        description: jobData.description || "",
        opportunityUrl: jobData.opportunityUrl || "",
        ...companyInfo,
        skills: removeDuplicates(jobData.skills || []),
        applicationOpenDate: jobData.applicationOpenDate || "",
        applicationCloseDate: jobData.applicationCloseDate || "",
      };

      // Reset form with job data
      form.reset(formData);

      // Preserve select field values that might get cleared by LocationInput initialization
      const selectFieldValues = {
        type: formData.type,
        locationType: formData.locationType,
        experienceLevel: formData.experienceLevel,
      };

      // Restore select fields if they get cleared during LocationInput initialization
      const restoreSelectFields = () => {
        const currentValues = form.getValues();
        let fieldsRestored = false;

        // Check and restore type field
        if (selectFieldValues.type && !currentValues.type) {
          form.setValue("type", selectFieldValues.type, {
            shouldValidate: false,
            shouldDirty: false,
          });
          fieldsRestored = true;
        }

        // Check and restore locationType field
        if (selectFieldValues.locationType && !currentValues.locationType) {
          form.setValue("locationType", selectFieldValues.locationType, {
            shouldValidate: false,
            shouldDirty: false,
          });
          fieldsRestored = true;
        }

        // Check and restore experienceLevel field
        if (
          selectFieldValues.experienceLevel &&
          !currentValues.experienceLevel
        ) {
          form.setValue("experienceLevel", selectFieldValues.experienceLevel, {
            shouldValidate: false,
            shouldDirty: false,
          });
          fieldsRestored = true;
        }

        if (fieldsRestored) {
          console.log("Restored cleared select fields");
        }
      };

      // Check and restore fields after LocationInput initialization
      setTimeout(restoreSelectFields, 100);

      setHasLoadedJobData(true);
      toast.success("Job data loaded successfully!");
    }
  }, [existingJob, isEditing, hasLoadedJobData, step, userData?.data?.role]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variables: {
      data: any;
      isEditing: boolean;
      jobId?: string;
    }) => {
      // Determine which ID to use: existing jobId from URL or newly created draftJobId
      const effectiveJobId = variables.jobId || draftJobId;

      if (variables.isEditing || effectiveJobId) {
        return updateJob(variables.data);
      } else {
        return postJob(variables.data);
      }
    },
    mutationKey: ["postJob"],
    onSuccess: (response, variables) => {
      // Handle the response structure for new job creation
      if (!variables.isEditing && !draftJobId && response?.data) {
        // This is the first submission (creating a draft), store the job ID
        setDraftJobId(response.data);
      }

      if (variables.data.status === "DRAFT") {
        toast.success(
          variables.isEditing || draftJobId
            ? "Draft updated successfully!"
            : "Draft saved successfully!",
        );
      } else {
        toast.success(
          variables.isEditing || draftJobId
            ? "Job updated successfully!"
            : "Job posted successfully!",
        );
        // Reset form and navigate for published jobs
        form.reset();
        navigate("/jobs");
      }

      // Invalidate jobs queries to refresh the jobs list
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
    },
    onError: (error: any) => {
      console.error("Error posting/updating job:", error);

      // Extract error message from the backend response
      let errorMessage =
        isEditing || draftJobId
          ? "Failed to update job. Please try again."
          : "Failed to post job. Please try again.";

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

  // Function to submit job and return a promise
  const submitJob = async (
    data: PostNewJobFormType,
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
      }

      const { location, applicationOpenDate, applicationCloseDate, ...rest } =
        data;

      // For drafts, handle potentially missing or invalid dates
      const formatDateSafely = (dateString: string) => {
        if (!dateString || dateString.trim() === "") {
          return ""; // Return empty string for missing dates in drafts
        }
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            return ""; // Return empty string for invalid dates in drafts
          }
          return format(date, "yyyy-MM-dd");
        } catch (error) {
          console.error("Error formatting date:", error);
          return ""; // Return empty string if formatting fails
        }
      };

      const formattedData = {
        ...rest,
        skills: removeDuplicates(rest.skills || []), // Remove duplicate skills
        location:
          Array.isArray(location) && location.length > 0
            ? location.filter(Boolean).join(", ") // Filter out empty strings and join
            : "", // Default to empty string if no location
        applicationOpenDate: applicationOpenDate
          ? status === "DRAFT"
            ? formatDateSafely(applicationOpenDate)
            : format(new Date(applicationOpenDate), "yyyy-MM-dd")
          : undefined,
        applicationCloseDate: applicationCloseDate
          ? status === "DRAFT"
            ? formatDateSafely(applicationCloseDate)
            : format(new Date(applicationCloseDate), "yyyy-MM-dd")
          : undefined,
        status,
        id: jobId || draftJobId || undefined,
      };

      const response = await mutateAsync({
        data: formattedData,
        isEditing: !!jobId || !!draftJobId,
      });

      // Store the job ID for subsequent updates
      if (!isEditing && !draftJobId && response?.data?.jobId) {
        setDraftJobId(response.data.jobId);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      throw error; // Re-throw to allow caller to handle
    }
  };

  const onSubmit = async (
    data: PostNewJobFormType,
    status: "DRAFT" | "PUBLISHED" = "PUBLISHED",
  ) => {
    return submitJob(data, status);
  };

  // Handle form submission for publishing
  const handlePublishJob = async (data: PostNewJobFormType) => {
    await onSubmit(data, "PUBLISHED");
  };

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

  return (
    <div>
      <Link
        to="/jobs"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      {/* Loading state for editing mode */}
      {isEditing && isLoadingJob && (
        <div className="flex items-center justify-center h-64 mt-5">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-custom-magenta-500 mx-auto" />
            <p className="mt-2 text-gray-600">Loading job data...</p>
          </div>
        </div>
      )}

      {/* Main content - hide while loading in edit mode */}
      {(!isEditing || !isLoadingJob) && (
        <div className="block space-y-5 lg:space-y-0 lg:grid lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-5">
          <div className="w-full h-fit p-3 md:p-4 lg:p-6 rounded-lg bg-white shadow-md lg:col-span-2">
            <h1 className="text-xl font-semibold">
              {isEditing ? "Edit Job Listing" : "Post a New Job Listing"}
            </h1>
            <p className="text-gray-600 text-sm mt-2 mb-4">
              {isEditing
                ? "Update your job listing details"
                : "Following steps to post new jobs"}
            </p>
            <div className="space-y-6">
              {stepLabels.map((label) => {
                const stepIndex = STEPS[label as keyof typeof STEPS] ?? 0;
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

          <div className=" border p-3 md:p-4 lg:p-6 rounded-lg bg-white lg:col-start-3 lg:col-span-4">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Never auto-submit, only through button click
                }}
              >
                {step === STEPS["Basic Job Information"] && (
                  <BasicJobInformation
                    form={form}
                    initialCountryName={locationData.countryName}
                    initialStateName={locationData.stateName}
                  />
                )}
                {userData?.data?.role !== "COMPANY" &&
                  step === STEPS["Company Information"] && (
                    <CompanyInformation form={form} />
                  )}

                {step === STEPS.Skills && <JobSkills form={form} />}
                {step === STEPS["Application Settings"] && (
                  <ApplicationSettings form={form} />
                )}

                <div className="mt-10 flex gap-4 justify-end">
                  <Button
                    type="button"
                    onClick={saveAsDraft}
                    className="px-4 py-2 h-10 bg-gray-200 text-custom-blue-800 hover:bg-gray-200 rounded disabled:opacity-50"
                  >
                    {isEditing ? "Update Draft" : "Add to Drafts"}
                  </Button>

                  <Button
                    type="button"
                    onClick={
                      step === stepLabels.length
                        ? () => {
                            form.handleSubmit(handlePublishJob)();
                          }
                        : nextStep
                    }
                    className="px-4 h-10 rounded disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending
                      ? isEditing
                        ? "Updating..."
                        : "Submitting..."
                      : step === stepLabels.length
                        ? isEditing
                          ? "Update Job"
                          : "Publish Job  "
                        : "Save and Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
