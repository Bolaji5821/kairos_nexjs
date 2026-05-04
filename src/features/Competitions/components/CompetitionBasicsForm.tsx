import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import RichText from "@/components/ui/RichText";
import { FileUploaderWithPreview } from "@/components/ui/FileUploaderWithPreview";
import type { UseFormReturn } from "react-hook-form";

export default function CompetitionBasicsForm({
  form,
  existingCoverImageUrl,
}: {
  form: UseFormReturn<any>;
  existingCoverImageUrl?: string;
}) {
  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  };

  return (
    <div className="">
      <div>
        <h2 className="text-lg font-semibold">Competition Basics</h2>
        <p className="text-gray-600 text-sm mt-2 mb-4">
          Following steps to post new competition
        </p>
      </div>

      <div className=" mt-10 flex flex-col gap-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Competition Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter competition title"
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
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter short description"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description of this challenge</FormLabel>
              <FormControl>
                <RichText
                  placeholder="Enter the competition description here"
                  {...field}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <FileUploaderWithPreview
                  value={existingCoverImageUrl || field.value}
                  onValueChange={(files) => field.onChange(files)}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                  id="coverImageInput"
                  uploadText="Click to upload banner image"
                  acceptedFormats="PNG, JPG, JPEG (Max 4MB)"
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
