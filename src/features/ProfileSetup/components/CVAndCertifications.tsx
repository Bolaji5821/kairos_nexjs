"use client";

import { type UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { FileUploaderWithPreview } from "@/components/ui/FileUploaderWithPreview";
import { CertificationsUploader } from "@/components/ui/CertificationsUploader";
import {
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import useUser from "@/hooks/useUser";

export default function CVAndCertifications({
  form,
}: {
  form: UseFormReturn<any>;
}) {
  const { user } = useUser();
  const resumeConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };
  const certificationsConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  return (
    <>
      <AlertDialogHeader className="text-left pb-6">
        <AlertDialogTitle className="text-2xl font-bold">
          CV and Certifications
        </AlertDialogTitle>
        <p className="">
          Let’s complete your profile with your resume and any certifications.
        </p>
      </AlertDialogHeader>

      <div className=" flex flex-col gap-8">
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV</FormLabel>
              <FormControl>
                <FileUploaderWithPreview
                  value={field.value || user?.data?.profile?.resume}
                  onValueChange={(files) => {
                    // For single file upload, take the first file or null
                    const singleFile =
                      files && files.length > 0 ? files[0] : null;
                    // Use form.setValue instead of field.onChange to force update
                    form.setValue("resume", singleFile, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  dropzoneOptions={resumeConfig}
                  className="relative bg-background rounded-lg p-2"
                  id="cvInput"
                  uploadText="Click to upload CV"
                  acceptedFormats="PDF, DOC, DOCX (Max 10MB)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
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
                  dropzoneOptions={certificationsConfig}
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
        {/* <Button type="submit">Submit</Button> */}
      </div>
    </>
  );
}
