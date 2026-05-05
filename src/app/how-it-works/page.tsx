import type { Metadata } from "next";
import { HowItWorksClient } from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works | Kairos",
  description: "Learn how Kairos works, for talent find vetted remote roles, for companies hire global experts faster. Step-by-step process from discovery to hire.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
