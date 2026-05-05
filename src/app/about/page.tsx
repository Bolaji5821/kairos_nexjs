import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Kairos",
  description: "Learn about Kairos, our mission, founders, trust partnerships, and commitment to reimagining global talent connectivity.",
};

export default function AboutPage() {
  return <AboutClient />;
}
