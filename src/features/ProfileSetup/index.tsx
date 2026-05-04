import { useEffect, useState } from "react";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/AlertDialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import JobDetails from "./components/JobDetails";
import CVAndCertifications from "./components/CVAndCertifications";
import AdditionalInformation from "./components/AdditionalInformation";
import EducationInformation from "./components/EducationInformation";
import Skills from "./components/Skills";
import { Form } from "@/components/ui/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser, updateProfilePicture } from "@/services/authService";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import CompanyDetails from "./components/CompanyDetails";
import CompanyProfileSetup from "./components/CompanyProfileSetup";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const studentProfileSetup = z.object({
  jobTitles: z.array(z.string()).min(1, "Please select at least one job title"),
  employmentType: z.string().min(1, "Please select an employment type"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  jobRole: z.string().min(1, "Please select a job role"),
  bio: z.string().optional(),
  gender: z.string().min(1, "Please select your gender"),
  address: z.string().min(1, "Please enter your address"),
  resume: z.any(),
  certifications: z.any(),
  universityAttended: z.string().optional(),
  universityEmail: z.string().optional(),
  certificate: z.any(),
  skillsets: z.array(z.string()).min(1, "Please select at least one skill"),
});

const recruiterProfileSetup = z.object({
  companyName: z.string().min(1, "Please type your company name"),
  industry: z.string().min(1, "Please select your industry"),
  companySize: z.string().optional(),
  companyWebsite: z.string().optional(),
  bio: z.string().optional(),
  address: z.string().optional(),
  employmentType: z.string().optional(),
  profilePicture: z.any(),
});

type StudentProfileSetupDetails = z.infer<typeof studentProfileSetup>;
type RecruiterProfileSetupDetails = z.infer<typeof recruiterProfileSetup>;

export default function ProfileSetup({ open, setOpen }: Props) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isCompany = user?.data.role === USER_ROLES.Company;

  const [currentStep, setCurrentStep] = useState(1);

  // Initialize forms with user data to prevent data loss on refresh
  const studentForm = useForm<StudentProfileSetupDetails>({
    resolver: zodResolver(studentProfileSetup),
    defaultValues: {
      jobTitles: Array.isArray(user?.data?.profile?.jobTitles)
        ? [
            ...new Set(
              user.data.profile.jobTitles.filter(
                (title: string) => title && title.trim(),
              ),
            ),
          ]
        : [],
      employmentType: user?.data?.profile?.employmentType || "",
      jobRole: user?.data?.profile?.jobRole || "",
      experienceLevel: user?.data?.profile?.experienceLevel || "",
      bio: user?.data?.profile?.bio || "",
      gender: user?.data?.profile?.gender || "",
      address: user?.data?.profile?.address || "",
      resume: null,
      certifications: null,
      universityAttended: user?.data?.profile?.universityAttended || "",
      universityEmail: user?.data?.profile?.universityEmail || "",
      certificate: null,
      skillsets: Array.isArray(user?.data?.skillSet)
        ? user.data.skillSet.map((skill) => skill.id).filter(Boolean)
        : [],
    },
  });

  const recruiterForm = useForm<RecruiterProfileSetupDetails>({
    resolver: zodResolver(recruiterProfileSetup),
    defaultValues: {
      companyName: user?.data?.profile?.companyName || "",
      industry: user?.data?.profile?.industry || "",
      companySize: user?.data?.profile?.companySize || "",
      companyWebsite: user?.data?.profile?.companyWebsite || "",
      bio: user?.data?.profile?.bio || "",
      address: user?.data?.profile?.address || "",
      employmentType: user?.data?.profile?.employmentType || "",
      profilePicture: null,
    },
  });

  // Update forms when user data changes (e.g., after login or data refresh)
  useEffect(() => {
    if (user?.data) {
      const profile = user.data.profile;
      const skillSet = user.data.skillSet;

      // Reset student form with user data
      studentForm.reset({
        jobTitles: Array.isArray(profile?.jobTitles)
          ? [
              ...new Set(
                profile.jobTitles.filter(
                  (title: string) => title && title.trim(),
                ),
              ),
            ]
          : [],
        employmentType: profile?.employmentType || "",
        experienceLevel: profile?.experienceLevel || "",
        jobRole: profile?.jobRole || "",
        bio: profile?.bio || "",
        gender: profile?.gender || "",
        address: profile?.address || "",
        resume: null, // Always null as we can't prefill file inputs
        certifications: null, // Always null as we can't prefill file inputs
        universityAttended: profile?.universityAttended || "",
        universityEmail: profile?.universityEmail || "",
        certificate: null, // Always null as we can't prefill file inputs
        skillsets: Array.isArray(skillSet)
          ? skillSet.map((skill) => skill.title).filter(Boolean)
          : [],
      });

      // Reset recruiter form with user data
      recruiterForm.reset({
        companyName: profile?.companyName || "",
        industry: profile?.industry || "",
        companySize: profile?.companySize || "",
        companyWebsite: profile?.companyWebsite || "",
        bio: profile?.bio || "",
        address: profile?.address || "",
        employmentType: profile.employmentType || "", // This field might not exist in profile, keeping as empty
        profilePicture: null, // Always null as we can't prefill file inputs
      });
    }
  }, [user, studentForm, recruiterForm]);

  const STUDENT_STEPS = {
    JobDetails: 1,
    SKills: 2,
    EducationInformation: 3,
    CVandCertifications: 4,
    AdditionalInformation: 5,
  } as const;

  const RECRUITER_STEPS = {
    CompanyDetails: 1,
    CompanyProfileSetup: 2,
  } as const;

  const maxSteps = isCompany ? 2 : 5;

  const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
    useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      // Invalidate user query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        localStorage.setItem("profileSetupSkipped", "true");

        setOpen(false);
        // Close dialog when completed
      }
    },
  });

  const { mutate: updateProfilePictureMutation } = useMutation({
    mutationFn: updateProfilePicture,
    onMutate: () => {
      setIsUploadingProfilePicture(true);
    },
    onSuccess: () => {
      setIsUploadingProfilePicture(false);
      // Invalidate user query to refresh user data after profile picture upload
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Continue with regular form submission after profilePicture upload
    },
    onError: (error: any) => {
      console.error("Failed to update profile picture:", error);
      setIsUploadingProfilePicture(false);
    },
  });

  // Map each step to its relevant field names based on user role
  const studentStepFields: Record<
    number,
    (keyof StudentProfileSetupDetails)[]
  > = {
    1: ["jobTitles", "employmentType", "experienceLevel", "jobRole"],
    2: ["skillsets"],
    3: ["universityAttended", "universityEmail", "certificate"],
    4: ["resume", "certifications"],
    5: ["bio", "gender", "address"],
  };

  const recruiterStepFields: Record<
    number,
    (keyof RecruiterProfileSetupDetails)[]
  > = {
    1: ["companyName", "industry", "companySize", "companyWebsite"],
    2: ["bio", "address", "employmentType", "profilePicture"],
  };

  const stepFields = isCompany ? recruiterStepFields : studentStepFields; // Helper to get filtered values for the current step and build FormData
  function getCurrentStepFormData() {
    const currentForm = isCompany ? recruiterForm : studentForm;
    const values = currentForm.getValues();
    const fieldsForStep = stepFields[currentStep] || [];

    const filteredEntries = fieldsForStep
      .filter((key) => key !== "profilePicture") // Exclude profilePicture as it's handled separately
      .map((key) => [key, (values as any)[key]])
      .filter(([_, v]) => {
        return Array.isArray(v)
          ? v.length > 0
          : v !== undefined && v !== null && v !== "";
      });

    const formData = new FormData();
    filteredEntries.forEach(([key, value]) => {
      // Handle arrays (skillsets, jobTitles, etc.) as comma-separated if needed
      if (Array.isArray(value)) {
        // Check if this is a file array
        if (value.length > 0 && value[0] instanceof File) {
          value.forEach((file: File) => {
            if (file instanceof File) {
              formData.append(key as string, file);
            }
          });
        } else {
          // Handle regular arrays (skillsets, jobTitles, etc.)
          const uniqueValues =
            key === "jobTitles"
              ? [
                  ...new Set(
                    value.filter((item: string) => item && item.trim()),
                  ),
                ]
              : [...new Set(value)];
          formData.append(key as string, uniqueValues.join(","));
        }
      } else if (
        ["resume", "certificate", "certifications"].includes(key as string)
      ) {
        // Handle single or multiple files
        if (Array.isArray(value)) {
          value.forEach((file: File) => {
            if (file instanceof File) {
              formData.append(key as string, file);
            }
          });
        } else if (value instanceof File) {
          formData.append(key as string, value);
        }
      } else {
        formData.append(key as string, value);
      }
    });
    return formData;
  }

  const onSubmit = () => {
    handleFormSubmission();
  };

  const handleNext = () => {
    handleFormSubmission();
  };

  const handleFormSubmission = () => {
    const currentForm = isCompany ? recruiterForm : studentForm;
    const values = currentForm.getValues();
    const fieldsForStep = stepFields[currentStep] || [];

    // Check if profilePicture is in current step fields
    const hasProfilePicture = fieldsForStep.includes("profilePicture" as any);
    const profilePictureFiles = (values as any).profilePicture;

    if (
      hasProfilePicture &&
      profilePictureFiles &&
      Array.isArray(profilePictureFiles) &&
      profilePictureFiles.length > 0
    ) {
      // Handle profilePicture separately
      const profilePictureFormData = new FormData();
      profilePictureFormData.append("profile-pic", profilePictureFiles[0]);
      updateProfilePictureMutation(profilePictureFormData);
    }

    // Get regular form data (excluding profilePicture)
    const formData = getCurrentStepFormData();
    mutate(formData);
  }; // Role-based validation logic

  const handleSkip = () => {
    localStorage.setItem("profileSetupSkipped", "true");
    setOpen(false);
  };

  const isValidStep = () => {
    if (isCompany) {
      // For recruiters, basic validation is enough
      return true;
    }

    // For students, special validation for skills step
    const isSkillsStep = currentStep === STUDENT_STEPS.SKills;
    if (isSkillsStep) {
      const selectedSkills = studentForm.watch("skillsets") || [];
      return Array.isArray(selectedSkills);
    }

    return true;
  };

  // Get button text based on current step and role
  const getButtonText = () => {
    if (isCompany) {
      return currentStep === RECRUITER_STEPS.CompanyProfileSetup
        ? "Submit"
        : "Next";
    }
    return currentStep === STUDENT_STEPS.AdditionalInformation
      ? "Submit"
      : "Next";
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className=" sm:max-w-lg lg:max-w-2xl">
        <div className=" flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* MultiStep Bars */}
        <div className="flex justify-between items-center pb-2">
          {Array.from({ length: maxSteps }, (_, index) => index + 1).map(
            (step) => (
              <div
                key={step}
                className={`flex-1 h-2 mx-1 rounded-full transition-colors duration-300 ${
                  currentStep >= step ? "bg-custom-magenta-500" : "bg-gray-200"
                }`}
              ></div>
            ),
          )}
        </div>
        {/* Student Form */}
        {!isCompany && (
          <Form {...studentForm}>
            <form onSubmit={studentForm.handleSubmit(onSubmit)}>
              {currentStep === STUDENT_STEPS.JobDetails && (
                <JobDetails form={studentForm} schema={studentProfileSetup} />
              )}
              {currentStep === STUDENT_STEPS.SKills && (
                <Skills form={studentForm} schema={studentProfileSetup} />
              )}
              {currentStep === STUDENT_STEPS.EducationInformation && (
                <EducationInformation
                  form={studentForm}
                  schema={studentProfileSetup}
                />
              )}
              {currentStep === STUDENT_STEPS.CVandCertifications && (
                <CVAndCertifications form={studentForm} />
              )}
              {currentStep === STUDENT_STEPS.AdditionalInformation && (
                <AdditionalInformation
                  form={studentForm}
                  schema={studentProfileSetup}
                />
              )}
            </form>
          </Form>
        )}
        {/* Recruiter Form */}
        {isCompany && (
          <Form {...recruiterForm}>
            <form onSubmit={recruiterForm.handleSubmit(onSubmit)}>
              {currentStep === RECRUITER_STEPS.CompanyDetails && (
                <CompanyDetails
                  form={recruiterForm}
                  schema={recruiterProfileSetup}
                />
              )}
              {currentStep === RECRUITER_STEPS.CompanyProfileSetup && (
                <CompanyProfileSetup
                  form={recruiterForm}
                  // schema={recruiterProfileSetup}
                />
              )}
            </form>
          </Form>
        )}
        <AlertDialogFooter className="w-full flex-row justify-between mt-6">
          <AlertDialogCancel className="w-[50%]" onClick={handleSkip}>
            Skip, I will do this later
          </AlertDialogCancel>

          <div className="w-[50%]">
            <Button
              loading={isPending || isUploadingProfilePicture}
              className=" w-full"
              onClick={handleNext}
              disabled={!isValidStep()}
            >
              {isUploadingProfilePicture ? "Uploading..." : getButtonText()}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
