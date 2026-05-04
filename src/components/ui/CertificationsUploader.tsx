import { useState, useEffect } from "react";
import { FileUploaderWithPreview } from "./FileUploaderWithPreview";
import { FilePreview } from "./FilePreview";

interface CertificationsUploaderProps {
  value: File[] | string[] | null;
  onValueChange: (value: File[] | null) => void;
  existingCertifications?: string[];
  dropzoneOptions: any;
  className?: string;
  id?: string;
  uploadText?: string;
  acceptedFormats?: string;
}

export function CertificationsUploader({
  value,
  onValueChange,
  existingCertifications = [],
  dropzoneOptions,
  className,
  id = "certificationsInput",
  uploadText = "Click to upload certifications",
  acceptedFormats,
}: CertificationsUploaderProps) {
  const [existingUrls, setExistingUrls] = useState<string[]>([]);

  useEffect(() => {
    // Set existing certifications URLs from user profile
    if (existingCertifications && existingCertifications.length > 0) {
      setExistingUrls(existingCertifications);
    }
  }, [existingCertifications]);

  // Handle removing an existing certification
  const handleRemoveExisting = (index: number) => {
    const newUrls = existingUrls.filter((_, i) => i !== index);
    setExistingUrls(newUrls);
    // Note: In a real implementation, you might want to call an API to actually delete
    // the certification from the backend. For now, we just hide it locally.
  };

  // Handle file upload
  const handleFileChange = (files: File[] | null) => {
    onValueChange(files);
  };

  // Get file array for the uploader
  const fileArray =
    Array.isArray(value) && value.length > 0 && value[0] instanceof File
      ? (value as File[])
      : [];

  return (
    <div className="space-y-4">
      {/* Show existing certifications */}
      {existingUrls.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600">Current certifications:</div>
          {existingUrls.map((url, index) => (
            <FilePreview
              key={url}
              fileUrl={url}
              onRemove={() => handleRemoveExisting(index)}
            />
          ))}
        </div>
      )}

      {/* File uploader for new files */}
      <FileUploaderWithPreview
        value={fileArray}
        onValueChange={handleFileChange}
        dropzoneOptions={dropzoneOptions}
        className={className}
        id={id}
        uploadText={uploadText}
        acceptedFormats={acceptedFormats}
        showPreview={false} // We handle preview above
      />

      {(existingUrls.length > 0 || fileArray.length > 0) && (
        <div className="text-xs text-gray-500">
          {existingUrls.length > 0 && fileArray.length > 0
            ? "Upload new files to add more certifications"
            : existingUrls.length > 0
              ? "Upload new files to add more certifications"
              : ""}
        </div>
      )}
    </div>
  );
}
