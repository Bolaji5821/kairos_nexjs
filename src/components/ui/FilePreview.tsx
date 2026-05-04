import { cn, isImageUrl, getFilenameFromUrl } from "@/lib/utils";
import { X, Eye, Download, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FilePreviewProps {
  fileUrl: string;
  onRemove?: () => void;
  className?: string;
  fileName?: string;
}

export function FilePreview({
  fileUrl,
  onRemove,
  className,
  fileName,
}: FilePreviewProps) {
  const filename = fileName || getFilenameFromUrl(fileUrl);
  const isImage = isImageUrl(fileUrl);

  const handleView = () => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={cn(
        "relative border border-gray-200 rounded-lg p-3 bg-white",
        className,
      )}
    >
      {/* Remove button */}
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {isImage ? (
        <div className="space-y-2">
          {/* Image preview */}
          <div className="relative">
            <img
              src={fileUrl}
              alt={filename}
              className="w-full h-32 object-cover rounded"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                const fallback = target.parentElement?.querySelector(
                  ".fallback-icon",
                ) as HTMLElement;
                target.style.display = "none";
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              className="fallback-icon absolute inset-0 items-center justify-center w-full h-32 bg-gray-100 rounded"
              style={{ display: "none" }}
            >
              <Image className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          {/* Image actions */}
          <div className="flex items-center justify-between">
            <p
              className="text-xs text-gray-600 truncate flex-1 mr-2"
              title={filename}
            >
              {filename}
            </p>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleView}
                title="View"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          {/* File icon */}
          <div className="flex-shrink-0">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-gray-900 truncate"
              title={filename}
            >
              {filename}
            </p>
            <p className="text-xs text-gray-500">Uploaded file</p>
          </div>

          {/* File actions */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleView}
              title="View"
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
