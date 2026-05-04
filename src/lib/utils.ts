import { toast } from "sonner";
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jobRoleOptions } from "./constants";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getErrorMessage = (error: any): string => {
  const errorMessage = error?.data?.message || error?.data?.detail;

  if (typeof errorMessage === "string") return errorMessage;
  return "An error has occurred";
};

export const toastError = (
  title?: string | null,
  error?: any,
  description?: string,
  stay?: boolean,
) => {
  const errorMessage = `${getErrorMessage(error)}. Please try again later.`;

  toast.error(title, {
    description: description ?? errorMessage,
    dismissible: stay ?? true,
    duration: stay ? 0 : 10000,
  });
};

export const toastSuccess = (
  title?: string,
  description?: string,
  stay?: boolean,
) => {
  toast.success(title, {
    description: description,
    dismissible: stay ?? true,
    duration: stay ? 0 : 4000,
  });
};

/**
 * Share functionality that works across desktop and mobile devices
 * On desktop: copies the URL to clipboard
 * On mobile: opens the native share dialog
 */
export const shareContent = async (options: {
  url?: string;
  title?: string;
  text?: string;
}) => {
  const {
    url = window.location.href,
    title = document.title,
    text = "",
  } = options;

  // Check if the device supports native sharing and is likely mobile
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth <= 768;

  if (isMobile && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return { success: true, method: "native" };
    } catch (error) {
      // If native sharing fails, fall back to clipboard
      console.warn("Native sharing failed, falling back to clipboard:", error);
    }
  }

  // Desktop or fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard", {
      description: "The link has been copied and is ready to share.",
    });
    return { success: true, method: "clipboard" };
  } catch (error) {
    // Final fallback: create a temporary text area and copy
    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      toast.success("Link copied to clipboard", {
        description: "The link has been copied and is ready to share.",
      });
      return { success: true, method: "fallback" };
    } catch (fallbackError) {
      toast.error("Failed to copy link", {
        description:
          "Unable to copy the link. Please copy it manually from the address bar.",
      });
      return { success: false, method: "none" };
    }
  }
};

/**
 * Filters competitions to only show those with open applications
 * @param competitions - Array of competition objects
 * @returns Array of competitions with open applications
 */
export const filterOpenCompetitions = (competitions: any[]) => {
  return competitions.filter((competition) => {
    if (!competition.applicationDeadline) return true;
    const deadline = new Date(competition.applicationDeadline);
    const now = new Date();
    return now <= deadline;
  });
};

/**
 * Check if a value is a storage link (URL string)
 */
export function isStorageLink(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  );
}

/**
 * Get the filename from a storage link URL
 */
export function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() || "file";
    return decodeURIComponent(filename);
  } catch {
    return "file";
  }
}

/**
 * Check if a file URL is an image based on its extension
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
  const filename = getFilenameFromUrl(url).toLowerCase();
  return imageExtensions.some((ext) => filename.endsWith(ext));
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const getEmploymentType = (type?: string) => {
  if (!type) return "Not specified";

  const match = jobRoleOptions.find((option) => option.value === type);
  return match ? match.label : type;
};

// Function to remove duplicates (case-insensitive)
export const removeDuplicates = (arr: string[]) => {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  return arr.filter((item) => {
    const lowerItem = item.toLowerCase().trim();
    if (seen.has(lowerItem)) {
      return false;
    }
    seen.add(lowerItem);
    return true;
  });
};

/**
 * Utility function to add red asterisk to required fields
 * @param labelText - The text for the label
 * @param schema - The Zod schema object
 * @param fieldName - The name of the field in the schema
 * @returns JSX element with label text and red asterisk if required
 */
export function addRequiredAsterisk(
  labelText: string,
  schema: z.ZodObject<any>,
  fieldName: string,
): React.ReactNode {
  const isRequired = isFieldRequired(schema, fieldName);

  return React.createElement(
    React.Fragment,
    null,
    labelText,
    isRequired &&
      React.createElement("span", { className: "text-red-500" }, "*"),
  );
}

/**
 * Check if a field is required in a Zod schema
 * @param schema - The Zod schema object
 * @param fieldName - The name of the field to check
 * @returns boolean indicating if the field is required
 */
function isFieldRequired(schema: z.ZodObject<any>, fieldName: string): boolean {
  try {
    const shape = schema.shape;
    const fieldSchema = shape[fieldName];

    if (!fieldSchema) return false;

    // Check if field is explicitly optional
    if (fieldSchema.isOptional && fieldSchema.isOptional()) {
      return false;
    }

    // Check for ZodOptional wrapper
    if (fieldSchema._def && fieldSchema._def.typeName === "ZodOptional") {
      return false;
    }

    // For ZodString, check if it has a minimum length > 0
    if (fieldSchema._def && fieldSchema._def.typeName === "ZodString") {
      const checks = fieldSchema._def.checks || [];
      const minCheck = checks.find((check: any) => check.kind === "min");
      return minCheck && minCheck.value > 0;
    }

    // For ZodArray, check if it has a minimum length > 0
    if (fieldSchema._def && fieldSchema._def.typeName === "ZodArray") {
      const checks = fieldSchema._def.checks || [];
      const minCheck = checks.find((check: any) => check.kind === "min");
      return minCheck && minCheck.value > 0;
    }

    // Default to required if not explicitly optional
    return true;
  } catch (error) {
    console.warn(`Error checking if field ${fieldName} is required:`, error);
    return false;
  }
}
