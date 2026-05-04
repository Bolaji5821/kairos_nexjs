import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CertificationsUploader } from "@/components/ui/CertificationsUploader";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command";
import DateInput from "@/components/ui/DateInput";
import { FileUploaderWithPreview } from "@/components/ui/FileUploaderWithPreview";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import LocationInput from "@/components/ui/LocationInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { Textarea } from "@/components/ui/Textarea";
import UniversityCombobox from "@/components/UniversityCombobox";
import Skills from "@/features/ProfileSetup/components/Skills";
import useUser from "@/hooks/useUser";
import {
  companySizeOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  genderOptions,
  industryOptions,
  jobRoleOptions,
  USER_ROLES,
} from "@/lib/constants";
import { removeDuplicates } from "@/lib/utils";
import { updateUser } from "@/services/authService";
import { getJobTitles } from "@/services/jobsService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Check, ChevronDown, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().optional(),
  bio: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  universityEmail: z
    .string()
    .optional()
    .refine(
      (email) =>
        !email || email === "" || z.string().email().safeParse(email).success,
      {
        message: "Invalid email format",
      },
    ),
  universityAttended: z.string().optional(),
  address: z.string().optional(),
  employmentType: z.string().optional(),
  experienceLevel: z.string().optional(),
  jobRole: z.string().optional(),
  companyName: z.string().optional(),
  companySize: z.string().optional(),
  companyWebsite: z.string().optional(),
  industry: z.string().optional(),
  companyCAC: z.string().optional(),
  skillsets: z.array(z.string()),
  jobTitles: z.array(z.string()),
  userLocation: z
    .object({
      country: z.string(),
      state: z.string(),
    })
    .optional(),
  // File upload fields
  resume: z.any().optional(),
  certificate: z.any().optional(),
  certifications: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      bio: "",
      phone: "",
      universityEmail: "",
      universityAttended: "",
      address: "",
      gender: user?.data.profile.gender || "",
      companySize: user?.data.profile.companySize || "",
      employmentType: user?.data.profile.employmentType || "",
      industry: user?.data.profile.industry || "",
      experienceLevel: user?.data.profile.experienceLevel || "",
      jobRole: user?.data.profile.jobRole || "",
      companyName: "",
      companyWebsite: "",
      companyCAC: "",
      skillsets: [],
      jobTitles: [],
      userLocation: { country: "", state: "" },
      resume: [],
      certificate: [],
      certifications: [],
    },
  });

  const [jobTitlesOpen, setJobTitlesOpen] = useState(false);
  const [jobTitleSearchQuery, setJobTitleSearchQuery] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [selectedStateName, setSelectedStateName] = useState<string>("");

  // Debounced search query for job titles
  const debouncedJobTitleSearchQuery = useMemo(
    () => debounce((query: string) => setJobTitleSearchQuery(query), 300),
    [],
  );

  // Fetch job titles from API with search query
  const { data: jobTitlesData, isLoading: jobTitlesLoading } = useQuery({
    queryKey: ["job-titles", jobTitleSearchQuery],
    queryFn: () => getJobTitles({ query: jobTitleSearchQuery }),
    enabled: jobTitlesOpen, // Only fetch when dropdown is open
  });

  // Extract job titles from API response
  const jobTitleOptions = useMemo(() => {
    if (!jobTitlesData?.data || !Array.isArray(jobTitlesData.data)) return [];
    return jobTitlesData.data.map((item) => item.title);
  }, [jobTitlesData]);

  const watchedJobTitles = form.watch("jobTitles");

  // Always deduplicate job titles for display, regardless of form state
  const uniqueJobTitles: string[] = useMemo(() => {
    if (!watchedJobTitles || !Array.isArray(watchedJobTitles)) return [];

    const filtered = (watchedJobTitles as string[]).filter(
      (title: string) => title && title.trim(),
    );
    return [...new Set(filtered)];
  }, [watchedJobTitles]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedJobTitleSearchQuery.cancel();
    };
  }, [debouncedJobTitleSearchQuery]);

  const isCompany = user?.data?.role === USER_ROLES.Company;

  // Initialize form data when user data is available
  useEffect(() => {
    if (user?.data?.profile && Object.keys(user.data.profile).length > 0) {
      const profile = user.data.profile;

      // Helper function to clean array data on load
      const cleanArrayOnLoad = (arr: any[]) => {
        if (!Array.isArray(arr)) return [];
        return arr.filter(
          (item) =>
            item &&
            typeof item === "string" &&
            item.trim() !== "" &&
            item !== "[]" &&
            !item.includes('["[]"]') &&
            !item.includes("[["),
        );
      };

      const formData = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        dob: profile.dob
          ? new Date(profile.dob).toISOString().split("T")[0]
          : "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        companySize: profile.companySize || "",
        employmentType: profile.employmentType || "",
        industry: profile.industry || "",
        experienceLevel: profile.experienceLevel || "",
        jobRole: profile.jobRole || "",
        phone: profile.phone || "",
        universityEmail: profile.universityEmail || "",
        universityAttended: profile.universityAttended || "",
        address: profile.address || "",
        companyName: profile.companyName || "",
        companyWebsite: profile.companyWebsite || "",
        companyCAC: profile.companyCAC || "",
        skillsets: user.data.skillSet?.map((skill: any) => skill.title) || [],
        interests: cleanArrayOnLoad(profile.interests || undefined),
        jobTitles: removeDuplicates(
          cleanArrayOnLoad(profile.jobTitles || undefined),
        ),
        userLocation: {
          country:
            profile.userLocation?.country ||
            (Array.isArray(profile.location) &&
            (profile.location as any).length >= 4
              ? String((profile.location as any)[2] || "")
              : ""),
          state:
            profile.userLocation?.state ||
            (Array.isArray(profile.location) &&
            (profile.location as any).length >= 4
              ? String((profile.location as any)[3] || "")
              : ""),
        },
        // Initialize file fields as empty arrays
        resume: [],
        certificate: [],
        certifications: [],
      };

      form.reset(formData);

      // Initialize location state variables for UI display
      if (profile.userLocation) {
        setSelectedCountryName(profile.userLocation.country || "");
        setSelectedStateName(profile.userLocation.state || "");
      }
    }
  }, [user?.data?.profile, user?.data?.skillSet, form]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const handleJobTitleSelect = (title: string) => {
    const currentTitles = form.getValues("jobTitles") || [];
    // Only add if not already present
    if (!currentTitles.includes(title)) {
      const uniqueTitles = [
        ...new Set([...currentTitles, title].filter((t) => t && t.trim())),
      ];
      form.setValue("jobTitles", uniqueTitles);
    }
  };

  const removeJobTitle = (titleToRemove: string) => {
    const currentTitles = form.getValues("jobTitles") || [];
    // Filter out the title and deduplicate
    const updatedTitles = [
      ...new Set(
        currentTitles.filter(
          (title: string) => title !== titleToRemove && title && title.trim(),
        ),
      ),
    ];
    form.setValue("jobTitles", updatedTitles);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formDataToSend = new FormData();

      // Helper function to filter out malformed data
      const cleanArrayData = (arr: string[]) => {
        return arr.filter(
          (item) =>
            item &&
            item.trim() !== "" &&
            item !== "[]" &&
            !item.includes('["[]"]') &&
            !item.includes("[["),
        );
      };

      // Add profile data - including empty fields
      Object.entries(data).forEach(([key, value]) => {
        // Skip jobTitles for company users
        if (key === "jobTitles" && isCompany) {
          return;
        }

        if (
          key === "resume" ||
          key === "certificate" ||
          key === "certifications"
        ) {
          // Handle file fields
          if (Array.isArray(value) && value.length > 0) {
            if (key === "certifications") {
              // Multiple files for certifications
              value.forEach((file: File) => {
                formDataToSend.append("certifications", file);
              });
            } else {
              // Single file for resume and certificate
              formDataToSend.append(key, value[0]);
            }
          }
          // Note: For files, we don't send empty values as they would be meaningless
        } else if (
          key === "userLocation" &&
          value &&
          typeof value === "object"
        ) {
          // Handle userLocation object: { country: string, state: string }
          // Send as JSON string to preserve the object structure
          formDataToSend.append("userLocation", JSON.stringify(value));
        } else if (
          key === "userLocation" &&
          (!value || typeof value !== "object")
        ) {
          // Send empty userLocation as empty object
          formDataToSend.append(
            "userLocation",
            JSON.stringify({ country: "", state: "" }),
          );
        } else if (Array.isArray(value)) {
          // Handle array fields (skillsets, interests, jobTitles)
          let cleanedArray = cleanArrayData(value);

          // Apply deduplication for jobTitles specifically
          if (key === "jobTitles") {
            cleanedArray = removeDuplicates(cleanedArray);
          }

          if (cleanedArray.length > 0) {
            // Send as individual entries, not JSON array
            cleanedArray.forEach((item) => {
              formDataToSend.append(key, item);
            });
          } else {
            // Send empty field to indicate intentionally cleared array
            formDataToSend.append(key, "");
          }
        } else {
          // Handle scalar fields - include empty strings to capture intentionally empty fields
          const stringValue =
            value !== null && value !== undefined ? value.toString() : "";
          formDataToSend.append(key, stringValue);
        }
      });

      updateProfile(formDataToSend);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit form");
    }
  };

  // Clean up form state on mount and when duplicates are detected
  useEffect(() => {
    if (watchedJobTitles && Array.isArray(watchedJobTitles)) {
      const currentTitles = watchedJobTitles as string[];
      const cleanTitles = [
        ...new Set(
          currentTitles.filter((title: string) => title && title.trim()),
        ),
      ];

      // Only update if there are actual duplicates or empty values
      if (JSON.stringify(cleanTitles) !== JSON.stringify(currentTitles)) {
        form.setValue("jobTitles", cleanTitles, { shouldValidate: false });
      }
    }
  }, [watchedJobTitles, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div>
          <p className="text-base font-semibold">Profile Settings</p>
          <p className="text-xs text-gray-400">
            Update your personal information and preferences
          </p>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-[200px_450px] xl:grid-cols-[250px_500px] gap-4">
          {/* Common Fields for Both Company and Student */}

          {/* Email (Read-only) */}
          <FormLabel className="text-sm font-medium">Email address</FormLabel>
          <div>
            <Input disabled value={user?.data?.email || ""} />
          </div>

          {/* First Name */}
          <FormLabel className="text-sm font-medium">First Name</FormLabel>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormLabel className="text-sm font-medium">Date of Birth</FormLabel>
          <DateInput
            maxDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 16)) // must be at least 16 years old
            }
            name="dob"
            control={form.control}
            hideLabel
          />

          {/* Gender */}
          <FormLabel className="text-sm font-medium">Gender</FormLabel>
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger variant="outline">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isCompany && (
            <>
              {/* Bio for Students */}
              <div>
                <FormLabel className="text-sm font-medium">Bio</FormLabel>
                <p className="text-xs text-gray-400">
                  Write a short introduction
                </p>
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Tell us about yourself..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Address - Common for both company and student */}
          <FormLabel className="text-sm font-medium">Address</FormLabel>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location - Common for both company and student */}
          <FormLabel className="text-sm font-medium">Location</FormLabel>
          <FormField
            control={form.control}
            name="userLocation"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <LocationInput
                    key={`${selectedCountryName}-${selectedStateName}`}
                    initialCountryName={selectedCountryName}
                    initialStateName={selectedStateName}
                    clearStateOnCountryChange={false}
                    onCountryChange={(country) => {
                      const countryName = country?.name || "";

                      setSelectedCountryName(countryName);

                      // Only reset state if user is making a manual change
                      // (not during initialization)
                      if (
                        selectedCountryName !== countryName &&
                        selectedCountryName !== ""
                      ) {
                        setSelectedStateName(""); // Reset state when country changes manually

                        // Store country and reset state in form
                        const newLocation = {
                          country: countryName,
                          state: "",
                        };
                        field.onChange(newLocation);
                        form.setValue("userLocation", newLocation);
                      } else {
                        // During initialization, keep the existing state
                        const newLocation = {
                          country: countryName,
                          state: selectedStateName,
                        };
                        field.onChange(newLocation);
                        form.setValue("userLocation", newLocation);
                      }
                    }}
                    onStateChange={(state) => {
                      const stateName = state?.name || "";

                      setSelectedStateName(stateName);

                      // Store country and state in form
                      const newLocation = {
                        country: selectedCountryName,
                        state: stateName,
                      };
                      field.onChange(newLocation);
                      form.setValue("userLocation", newLocation);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Student-specific fields */}
          {!isCompany && (
            <>
              {/* Job Title */}

              <div>
                <FormLabel className="text-sm font-medium">
                  Job Titles
                </FormLabel>
                <p className="text-xs text-gray-400">
                  Add job titles you're interested in
                </p>
              </div>

              <FormField
                control={form.control}
                name="jobTitles"
                render={() => (
                  <FormItem>
                    <div className="space-y-3">
                      <Popover
                        open={jobTitlesOpen}
                        onOpenChange={setJobTitlesOpen}
                        modal
                      >
                        <PopoverTrigger className="w-full" asChild>
                          <FormControl>
                            <Button
                              variant="ghost"
                              role="combobox"
                              className="w-full justify-between h-12 px-4"
                            >
                              <span className="text-muted-foreground text-sm">
                                Select job title
                              </span>
                              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[170px] p-0">
                          <Command
                            className="w-full max-h-[170px]"
                            shouldFilter={false}
                          >
                            <CommandInput
                              placeholder="Search job titles..."
                              onValueChange={(value) => {
                                debouncedJobTitleSearchQuery(value);
                              }}
                            />
                            <CommandGroup className="w-full max-h-[170px] overflow-y-auto">
                              {jobTitlesLoading ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="ml-2 text-sm">
                                    Loading job titles...
                                  </span>
                                </div>
                              ) : jobTitleOptions.length > 0 ? (
                                jobTitleOptions.map((title) => (
                                  <CommandItem
                                    key={title}
                                    className="w-full"
                                    onSelect={() => {
                                      handleJobTitleSelect(title);
                                      setJobTitlesOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        uniqueJobTitles.includes(title)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    {title}
                                  </CommandItem>
                                ))
                              ) : (
                                <div className="p-4 text-sm text-muted-foreground">
                                  No job titles available
                                </div>
                              )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Selected job titles */}
                      {uniqueJobTitles && uniqueJobTitles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {uniqueJobTitles.map((title: string) => (
                            <Badge
                              key={title}
                              className="bg-[#EAEAF1] text-[#2C3177] px-3 text-xs rounded-md"
                            >
                              {title}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-auto p-0 hover:bg-transparent text-[#2C3177] hover:text-[#2C3177] has-[>svg]:px-0"
                                onClick={() => removeJobTitle(title)}
                              >
                                <X className="h-3 w-3" color="#FC4A1A" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Type */}
              <FormLabel className="text-sm font-medium">
                Employment Type
              </FormLabel>
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Experience Level */}
              <FormLabel className="text-sm font-medium">
                Experience Level
              </FormLabel>
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Role */}
              <FormLabel className="text-sm font-medium">Job Role</FormLabel>
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select job role" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobRoleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <div>
                <FormLabel className="text-sm font-medium">Skills</FormLabel>
                <p className="text-xs text-gray-400">Add your skills</p>
              </div>
              <div>
                <Skills hideTitle form={form} fieldName="skillsets" />
              </div>

              {/* University Attended */}
              <FormLabel className="text-sm font-medium">
                University Attended
              </FormLabel>
              <FormField
                control={form.control}
                name="universityAttended"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UniversityCombobox
                        field={field}
                        placeholder="Select university"
                        label=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* University Email */}
              <FormLabel className="text-sm font-medium">
                University Email
              </FormLabel>
              <FormField
                control={form.control}
                name="universityEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="student@university.edu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Certificate */}
              <FormLabel className="text-sm font-medium">Certificate</FormLabel>
              <FormField
                control={form.control}
                name="certificate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploaderWithPreview
                        value={user?.data?.profile?.certificate || field.value}
                        onValueChange={(files) => {
                          // For single file upload, take the first file or null
                          const singleFile =
                            files && files.length > 0 ? files[0] : null;
                          form.setValue("certificate", singleFile, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        dropzoneOptions={{
                          maxFiles: 1,
                          maxSize: 1024 * 1024 * 10, // 10MB
                          multiple: false,
                          accept: {
                            "application/pdf": [".pdf"],
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          },
                        }}
                        className="relative bg-background rounded-lg p-2"
                        id="certificateInput"
                        uploadText="Click to upload certificate"
                        acceptedFormats="PDF, JPG, JPEG, PNG (Max 10MB)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CV/Resume */}
              <FormLabel className="text-sm font-medium">CV</FormLabel>
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploaderWithPreview
                        value={user?.data?.profile?.resume || field.value}
                        onValueChange={(files) => {
                          // For single file upload, take the first file or null
                          const singleFile =
                            files && files.length > 0 ? files[0] : null;
                          form.setValue("resume", singleFile, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        dropzoneOptions={{
                          maxFiles: 1,
                          maxSize: 1024 * 1024 * 10, // 10MB
                          multiple: false,
                          accept: {
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                              [".docx"],
                          },
                        }}
                        className="relative bg-background rounded-lg p-2"
                        id="resumeInput"
                        uploadText="Click to upload CV"
                        acceptedFormats="PDF, DOC, DOCX (Max 10MB)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Certifications */}
              <FormLabel className="text-sm font-medium">
                Certifications
              </FormLabel>
              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CertificationsUploader
                        value={field.value}
                        onValueChange={(files) => {
                          // Use form.setValue instead of field.onChange to force update
                          form.setValue("certifications", files, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                        existingCertifications={
                          user?.data?.profile?.certifications || []
                        }
                        dropzoneOptions={{
                          maxFiles: 5,
                          maxSize: 1024 * 1024 * 10, // 10MB per file
                          multiple: true,
                          accept: {
                            "application/pdf": [".pdf"],
                            "image/jpeg": [".jpg", ".jpeg"],
                            "image/png": [".png"],
                          },
                        }}
                        className="relative bg-background rounded-lg p-2"
                        id="certificationsInput"
                        uploadText="Click to upload certifications"
                        acceptedFormats="PDF, JPG, JPEG, PNG (Max 5 files, 10MB each)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Company-specific fields */}
          {isCompany && (
            <>
              {/* Company Name */}
              <FormLabel className="text-sm font-medium">
                Company Name
              </FormLabel>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry */}
              <FormLabel className="text-sm font-medium">Industry</FormLabel>
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map((option) => (
                            <SelectItem key={option.label} value={option.label}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Size */}
              <FormLabel className="text-sm font-medium">
                Company Size
              </FormLabel>
              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Website */}
              <FormLabel className="text-sm font-medium">
                Company Website
              </FormLabel>
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="https://company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* About the Company (Bio) */}
              <div>
                <FormLabel className="text-sm font-medium">
                  About the Company
                </FormLabel>
                <p className="text-xs text-gray-400">
                  Write about your company
                </p>
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your company..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Employment Type */}
              <FormLabel className="text-sm font-medium">
                Employment Type
              </FormLabel>
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger variant="outline">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {employmentTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isPending} className="px-8">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
