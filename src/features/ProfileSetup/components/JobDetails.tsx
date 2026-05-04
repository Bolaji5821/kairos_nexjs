import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Check, ChevronDown, X, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import useUser from "@/hooks/useUser";
import {
  employmentTypeOptions,
  experienceLevelOptions,
  jobRoleOptions,
} from "@/lib/constants";
import { getJobTitles } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { addRequiredAsterisk } from "@/lib/utils";

type Props = {
  form: UseFormReturn<any>;
  schema?: any; // Schema passed from parent component
};

export default function JobDetails({ form, schema }: Props) {
  const [jobTitlesOpen, setJobTitlesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const watchedJobTitles = form.watch("jobTitles");
  const { user } = useUser();

  // Debounced search query
  const debouncedSearchQuery = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    [],
  );

  // Fetch job titles from API with search query
  const { data: jobTitlesData, isLoading: jobTitlesLoading } = useQuery({
    queryKey: ["job-titles", searchQuery],
    queryFn: () => getJobTitles({ query: searchQuery }),
    enabled: jobTitlesOpen, // Only fetch when dropdown is open
  });

  // Extract job titles from API response
  const jobTitleOptions = useMemo(() => {
    if (!jobTitlesData?.data || !Array.isArray(jobTitlesData.data)) return [];
    return jobTitlesData.data.map((item) => item.title);
  }, [jobTitlesData]);

  // Always deduplicate job titles for display, regardless of form state
  const uniqueJobTitles: string[] = useMemo(() => {
    if (!watchedJobTitles || !Array.isArray(watchedJobTitles)) return [];

    const filtered = (watchedJobTitles as string[]).filter(
      (title: string) => title && title.trim(),
    );
    return [...new Set(filtered)];
  }, [watchedJobTitles]);

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

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearchQuery.cancel();
    };
  }, [debouncedSearchQuery]);

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

  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          Job Details
        </AlertDialogTitle>
        <p>
          It's nice to meet you {user?.data.profile.firstName}, What is your
          recent job title?
        </p>
      </AlertDialogHeader>

      <div className=" flex flex-col gap-8">
        <FormField
          control={form.control}
          name="jobTitles"
          render={() => (
            <FormItem>
              <FormLabel className="text-sm font-medium" required>
                Job Title
              </FormLabel>
              <div className="space-y-3">
                <Popover
                  open={jobTitlesOpen}
                  onOpenChange={setJobTitlesOpen}
                  modal
                >
                  <PopoverTrigger className=" w-full" asChild>
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
                          debouncedSearchQuery(value);
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
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium">
                  {(schema &&
                    addRequiredAsterisk(
                      "Employment Type",
                      schema,
                      "employmentType",
                    )) ||
                    "Employment Type"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className=" h-32">
                    <SelectTrigger variant="outline">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employmentTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium">
                  {(schema &&
                    addRequiredAsterisk(
                      "Experience Level",
                      schema,
                      "experienceLevel",
                    )) ||
                    "Experience Level"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className=" h-32">
                    <SelectTrigger variant="outline">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job Role */}
        <FormField
          control={form.control}
          name="jobRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                {(schema &&
                  addRequiredAsterisk("Job Role", schema, "jobRole")) ||
                  "Job Role"}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger variant="outline" className="h-12">
                    <SelectValue placeholder="Select the job you are looking for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobRoleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
