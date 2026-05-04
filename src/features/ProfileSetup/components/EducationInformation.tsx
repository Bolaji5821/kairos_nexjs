"use client";

import { type UseFormReturn } from "react-hook-form";
import useUser from "@/hooks/useUser";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import UniversityCombobox from "@/components/UniversityCombobox";
import { FileUploaderWithPreview } from "@/components/ui/FileUploaderWithPreview";
import { AlertDialogHeader } from "@/components/ui/AlertDialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

import { addRequiredAsterisk } from "@/lib/utils";

export default function EducationInformation({
  form,
  schema,
}: {
  form: UseFormReturn<any>;
  schema?: any;
}) {
  const { user } = useUser();
  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          Education Information
        </AlertDialogTitle>
        <p className="">
          Kindly provide your university details and the following documents
        </p>
      </AlertDialogHeader>

      <div className=" flex flex-col gap-8">
        <FormField
          control={form.control}
          name="universityAttended"
          render={({ field }) => (
            <UniversityCombobox
              field={field}
              label="University Attended"
              placeholder="Select university"
              isOptional={false}
            />
          )}
        />

        <FormField
          control={form.control}
          name="universityEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {(schema &&
                  addRequiredAsterisk(
                    "University Email",
                    schema,
                    "universityEmail",
                  )) ||
                  "University Email"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter university email"
                  type=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Certificate (Optional)</FormLabel>
              <FormControl>
                <FileUploaderWithPreview
                  value={field.value || user?.data?.profile?.certificate}
                  onValueChange={(files) => {
                    // For single file upload, take the first file or null
                    const singleFile =
                      files && files.length > 0 ? files[0] : null;
                    // Use form.setValue instead of field.onChange to force update
                    form.setValue("certificate", singleFile, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  dropzoneOptions={dropZoneConfig}
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
      </div>
    </>
  );
}
