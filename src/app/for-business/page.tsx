import type { Metadata } from "next";
import { CompanyLanding } from "@/components/layout/company-landing";

export const metadata: Metadata = {
  title: "For Businesses | Kairos",
  description: "Cut hiring costs by up to 70%. Access pre-vetted global talent with Kairos. Hire faster, save more, reduce risk.",
};

export default function ForBusinessPage() {
  return <CompanyLanding />;
}
