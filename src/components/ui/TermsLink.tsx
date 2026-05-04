import { cn } from "@/lib/utils";
import React from "react";

const TERMS_PDF_PATH = "/kairos-terms-and-conditions-aug-5-2025.pdf";

export interface TermsLinkProps {
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

export default function TermsLink({
  className,
  children,
  href = TERMS_PDF_PATH,
}: TermsLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-custom-magenta-500", className)}
    >
      {children ?? "Terms & Conditions."}
    </a>
  );
}
