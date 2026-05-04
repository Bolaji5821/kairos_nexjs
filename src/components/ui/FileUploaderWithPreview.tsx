import { useState, useEffect } from "react";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/FileInput";
import { FilePreview } from "@/components/ui/FilePreview";
import { isStorageLink } from "@/lib/utils";
import { CloudUpload, Paperclip, Loader2 } from "lucide-react";

interface FileUploaderWithPreviewProps {
  value: File[] | File | string | string[] | null;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions: any;
  className?: string;
  id?: string;
  uploadText?: string;
  acceptedFormats?: string;
  showPreview?: boolean;
  isLoading?: boolean;
}

export function FileUploaderWithPreview({
  value,
  onValueChange,
  dropzoneOptions,
  className,
  id = "fileInput",
  uploadText = "Click to upload",
  acceptedFormats,
  showPreview = true,
  isLoading = false,
}: FileUploaderWithPreviewProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Handle different value types
    if (isStorageLink(value)) {
      // Single storage link
      setPreviewUrls([value]);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
    ) {
      // Array of storage links
      setPreviewUrls(value as string[]);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value[0] instanceof File
    ) {
      // Array of File objects - create object URLs for preview
      const fileArray = value as File[];
      const urls = fileArray.map((file: File) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else if (value instanceof File) {
      // Single File object - create object URL for preview
      const url = URL.createObjectURL(value);
      setPreviewUrls([url]);
    } else {
      setPreviewUrls([]);
    }

    // Cleanup function to revoke object URLs to prevent memory leaks
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [value]);

  // Handle removing a specific preview
  const handleRemovePreview = (index: number) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);

    // For now, when any preview is removed, clear the field completely
    // This is the safest approach as it forces the user to re-upload files
    onValueChange(null);
  };

  // Handle file upload
  const handleFileChange = (files: File[] | null) => {
    onValueChange(files);
  };

  // If we have preview URLs, show the previews
  if (previewUrls.length > 0 && showPreview) {
    return (
      <div className="space-y-3">
        {previewUrls.map((url, index) => {
          // For File objects, we need to pass additional metadata
          let fileData = { url, name: "" };

          if (value instanceof File) {
            fileData = { url, name: value.name };
          } else if (Array.isArray(value) && value[0] instanceof File) {
            const fileArray = value as File[];
            fileData = { url, name: fileArray[index]?.name || "" };
          } else {
            fileData = { url, name: "" };
          }

          return (
            <FilePreview
              key={url}
              fileUrl={url}
              fileName={fileData.name}
              onRemove={() => handleRemovePreview(index)}
            />
          );
        })}
        <div className="text-xs text-gray-500">
          Upload new files to replace the current ones
        </div>
      </div>
    );
  }

  // Otherwise show the normal file uploader
  // Handle value as either single File or array of Files
  let fileArray: File[] = [];
  if (value instanceof File) {
    fileArray = [value];
  } else if (Array.isArray(value)) {
    fileArray = value.filter((item): item is File => item instanceof File);
  }

  return (
    <FileUploader
      value={fileArray}
      onValueChange={handleFileChange}
      dropzoneOptions={dropzoneOptions}
      className={className}
    >
      <FileInput id={id} className="outline-dashed outline-1 outline-slate-500">
        <div className="flex items-center justify-center flex-col p-8 w-full">
          {isLoading ? (
            <>
              <Loader2 className="text-gray-500 w-10 h-10 animate-spin" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold text-custom-magenta-500">
                  Uploading...
                </span>
              </p>
              <p className="text-xs text-gray-500">Please wait</p>
            </>
          ) : (
            <>
              <CloudUpload className="text-gray-500 w-10 h-10" />
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold text-custom-magenta-500">
                  {uploadText}
                </span>
              </p>
              {acceptedFormats && (
                <p className="text-xs text-gray-500">{acceptedFormats}</p>
              )}
            </>
          )}
        </div>
      </FileInput>
      <FileUploaderContent>
        {fileArray.length > 0 &&
          fileArray.map((file: File, i: number) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
}
