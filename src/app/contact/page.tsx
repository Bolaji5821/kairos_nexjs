import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Kairos",
  description: "Get in touch with Kairos, whether you're talent seeking work or a business hiring globally, we're here to help.",
};

export default function ContactPage() {
  return <ContactClient />;
}
