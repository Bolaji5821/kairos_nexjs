import type { Metadata } from "next";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Kairos",
  description: "Privacy Policy for Kairos platform, how we collect, use, protect, and govern your personal information across our global talent marketplace.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
