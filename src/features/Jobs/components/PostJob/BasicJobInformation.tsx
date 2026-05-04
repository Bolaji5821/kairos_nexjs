import type { UseFormReturn } from "react-hook-form";

import CompensationInput from "@/components/ui/CompensationInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import LocationSelector from "@/components/ui/LocationInput";
import RichText from "@/components/ui/RichText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  employmentTypeOptions,
  experienceLevelOptions,
  jobRoleOptions,
} from "@/lib/constants";
import { useEffect, useState } from "react";

export default function BasicJobInformation({
  form,
  initialCountryName = "",
  initialStateName = "",
}: {
  form: UseFormReturn<any>;
  initialCountryName?: string;
  initialStateName?: string;
}) {
  const [countryName, setCountryName] = useState<string>(initialCountryName);
  const [stateName, setStateName] = useState<string>(initialStateName);

  // Update state when initial values change
  useEffect(() => {
    setCountryName(initialCountryName);
    setStateName(initialStateName);
  }, [initialCountryName, initialStateName]);

  return (
    <div className="">
      <div>
        <h2 className="text-lg font-semibold">Basic Job Information</h2>
        <p className="text-gray-600 text-sm mt-2 mb-4">
          Following steps to post new jobs
        </p>
      </div>

      <div className=" mt-10 flex flex-col gap-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the job title"
                  className=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="compensation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compensation</FormLabel>
              <FormControl>
                <CompensationInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter amount"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger variant="outline">
                    <SelectValue placeholder="Select the employment type" />
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

        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs font-medium">
                Location Type
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="h-32">
                  <SelectTrigger variant="outline">
                    <SelectValue
                      placeholder="Select the job location type"
                      className="text-base md:text-xs"
                    />
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-xs font-medium">
                  Experience Level
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className=" h-32">
                    <SelectTrigger variant="outline">
                      <SelectValue placeholder="Select an experience level" />
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

          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of experience</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What years of experience is required for this job?"
                    className=""
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <LocationSelector
                  initialCountryName={initialCountryName}
                  initialStateName={initialStateName}
                  onCountryChange={(country) => {
                    const newCountryName = country?.name || "";
                    setCountryName(newCountryName);
                    form.setValue(
                      field.name,
                      [newCountryName, stateName || ""],
                      { shouldValidate: false, shouldDirty: true },
                    );
                  }}
                  onStateChange={(state) => {
                    const newStateName = state?.name || "";
                    setStateName(newStateName);
                    form.setValue(
                      field.name,
                      [countryName || "", newStateName],
                      { shouldValidate: false, shouldDirty: true },
                    );
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Job Description</FormLabel>
              <FormControl>
                <RichText
                  placeholder="Enter the job description or requirements here"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="opportunityUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opportunity URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the opportunity URL (optional)"
                  className=""
                  type="url"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
