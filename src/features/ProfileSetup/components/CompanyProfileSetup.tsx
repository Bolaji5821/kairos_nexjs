import type { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateProfilePicture } from "@/services/authService";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { FileUploaderWithPreview } from "@/components/ui/FileUploaderWithPreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Input } from "@/components/ui/Input";
import { employmentTypeOptions } from "@/lib/constants";
import useUser from "@/hooks/useUser";

export default function CompanyProfileSetup({
  form,
}: {
  form: UseFormReturn<any>;
}) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { mutate: updateProfilePictureMutation } = useMutation({
    mutationFn: updateProfilePicture,
    onMutate: () => {
      setIsUploadingLogo(true);
    },
    onSuccess: () => {
      setIsUploadingLogo(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Company logo uploaded successfully!");
    },
    onError: (error: any) => {
      setIsUploadingLogo(false);
      toast.error(error?.message || "Failed to upload company logo");
    },
  });

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          Company Profile Setup
        </AlertDialogTitle>
        <p className="">Let’s help people recognize your brand</p>
      </AlertDialogHeader>

      <div className="flex flex-col gap-8">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About the company</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tell us something about the company"
                  className=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex gap-8">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type your company address"
                    type="text"
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
            name="employmentType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium">
                  Employment Type
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
        </div>

        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <FormControl>
                <FileUploaderWithPreview
                  value={user?.data?.profile?.profilePicture || field.value}
                  onValueChange={(files) => {
                    // Upload immediately when file is selected
                    if (files && files.length > 0) {
                      const formData = new FormData();
                      formData.append("profile-pic", files[0]);
                      updateProfilePictureMutation(formData);
                    }

                    field.onChange(files);
                  }}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                  id="companyLogoInput"
                  uploadText="Click to upload company logo"
                  acceptedFormats="JPG, PNG, SVG (Max 5MB)"
                  isLoading={isUploadingLogo}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
