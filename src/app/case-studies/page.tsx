import type { Metadata } from "next";
import { CaseStudiesClient } from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies | Kairos",
  description: "Real success stories from Kairos, see how talent land dream roles and companies save 60–70% on hiring with our vetted marketplace.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
