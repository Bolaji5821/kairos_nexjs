import type { Metadata } from "next";
import { CompanyLanding } from "@/components/layout/company-landing";

export const metadata: Metadata = {
  title: "Hire Talent | Kairos",
  description: "Hire verified global experts at 60-70% savings. Access pre-vetted talent across marketing, design, engineering, and support.",
};

export default function HireTalentPage() {
  return <CompanyLanding />;
}
