"use client";

import { useIntent } from "@/components/providers/intent-provider";
import { JobLanding } from "@/components/layout/job-landing";
import { CompanyLanding } from "@/components/layout/company-landing";

export default function Home() {
  const { intent } = useIntent();

  return (
    <>
      {intent === "talent" ? <JobLanding /> : <CompanyLanding />}
    </>
  );
}
