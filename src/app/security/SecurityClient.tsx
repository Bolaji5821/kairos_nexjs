"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SecurityClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "intro",
      title: "Built on Trust. Governed by Principle.",
      content: (
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
          Security, ethics, and compliance are not checkboxes at Kairos, they are the foundation every decision is built on. We protect users, businesses, partners, and the integrity of the platform.
        </p>
      ),
    },
    {
      id: "data-security",
      title: "Data Security",
      items: [
        { title: "AES-256 encryption at rest", desc: "Military-grade encryption for all stored data" },
        { title: "TLS 1.2+ encryption in transit", desc: "All transmissions protected with latest TLS protocols" },
        { title: "Multi-factor authentication (MFA)", desc: "Required for all administrative and internal access" },
        { title: "Role-based access controls", desc: "Strict internal permissions limit data visibility" },
        { title: "Secure cloud infrastructure", desc: "Hosted on enterprise-grade providers (AWS) with high availability and security compliance" },
      ],
    },
    {
      id: "ethical-ai",
      title: "Ethical AI",
      items: [
        { title: "AI is purpose-bound to platform functions", desc: "Processed strictly for defined platform purposes, not surveillance or external profiling" },
        { title: "No data sold to train external AI", desc: "User data never exploited to train third-party AI systems without explicit consent" },
        { title: "AI insights remain platform-controlled", desc: "Matching scores and assessments stay within Kairos ecosystem" },
        { title: "Users may request deletion of AI-derived data", desc: "Consistent with applicable laws and data protection rights" },
        { title: "Consent required before any AI data use beyond scope", desc: "New explicit consent needed for any repurposing of AI-processed data" },
      ],
    },
    {
      id: "global-compliance",
      title: "Global Compliance",
      items: [
        { title: "GDPR", desc: "EU General Data Protection Regulation, full compliance for EEA users" },
        { title: "CCPA / CPRA", desc: "California Consumer Privacy Act, transparency and control for California residents" },
        { title: "NDPR", desc: "Nigeria Data Protection Regulation, NDPB-administered compliance" },
        { title: "Multi-jurisdictional rights", desc: "Users may exercise rights under all applicable frameworks" },
      ],
    },
    {
      id: "data-classification",
      title: "Data Classification",
      items: [
        { title: "Account information", desc: "Name, email, phone, profile details, for identity and communication" },
        { title: "Identity verification data", desc: "NIN, SSN, EIN, government ID, for fraud prevention and vetting" },
        { title: "Payment information", desc: "Bank details, transaction data, for escrow and facilitation" },
        { title: "Platform usage & behavioral data", desc: "Activity logs, interactions, for improvement and safety" },
        { title: "AI assessment data", desc: "Matching scores, skill evaluations, for vetting and matching" },
        { title: "Partner-shared data", desc: "Integration exchange, only for agreed, defined purposes" },
      ],
    },
    {
      id: "partner-governance",
      title: "Partner Governance",
      items: [
        { title: "Data shared for agreed purposes only", desc: "Strictly limited to documented use cases" },
        { title: "Partner data is never resold", desc: "No commercial exploitation of shared data" },
        { title: "All integration activity is logged & auditable", desc: "Complete audit trails maintained by Kairos" },
        { title: "Data deleted within 30 days on termination", desc: "Secure deletion protocols unless legally required to retain" },
        { title: "Partners must maintain comparable standards", desc: "Compliance certification required upon request" },
      ],
    },
    {
      id: "breach-response",
      title: "Breach Response",
      items: [
        { title: "Internal investigation initiated immediately", desc: "No delay in assessing potential incidents" },
        { title: "Affected users notified within 72 hours", desc: "Where legally required under GDPR, CCPA/CPRA, or NDPR" },
        { title: "Notification via email & in-platform alert", desc: "Multi-channel communication to ensure awareness" },
        { title: "Regulatory authorities notified where required", desc: "Full legal and regulatory compliance" },
      ],
      contact: {
        title: "Security Contact",
        value: "security@kairosng.com",
      },
    },
  ];

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <Link
            href="/"
            className="inline-flex items-center text-zinc-500 hover:text-[#C2185B] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="text-center">
            <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-4 block">
              Our Commitment
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              Security & Compliance
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Military-grade encryption, ethical AI governance, and global regulatory compliance, operationalized, not aspirational.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-16">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              {/* Section Header */}
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-3">
                  {section.title}
                </h2>
                {section.content}
              </div>

              {/* Section Items */}
              {section.items && (
                <div className="space-y-4">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-start gap-3 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Box for Breach Response */}
              {section.contact && (
                <div className="mt-6 p-6 bg-[#C2185B]/5 border border-[#C2185B]/20 rounded-2xl">
                  <p className="text-sm font-bold text-[#C2185B] mb-2">{section.contact.title}</p>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {section.contact.value}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-24 max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800/50">
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              These are not aspirational policies.
            </h2>
            <p className="text-zinc-400 text-lg">
              They are operational commitments we hold ourselves to every day.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2185B] opacity-10 blur-[80px] -mr-32 -mt-32" />
        </div>
      </div>
    </div>
  );
}
