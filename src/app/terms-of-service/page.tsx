import type { Metadata } from "next";
import { TermsOfServiceClient } from "./TermsOfServiceClient";

export const metadata: Metadata = {
  title: "Terms of Service | Kairos",
  description: "Terms of Service for Kairos platform, rules, guidelines, and legal agreements for using our talent marketplace.",
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
