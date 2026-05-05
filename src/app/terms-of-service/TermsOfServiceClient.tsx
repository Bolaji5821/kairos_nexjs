"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function TermsOfServiceClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { id: "1", title: "1. Acceptance of Terms", href: "#section-1" },
    { id: "2", title: "2. Nature of the Platform (CRITICAL)", href: "#section-2" },
    { id: "3", title: "3. Future Features Disclaimer", href: "#section-3" },
    { id: "4", title: "4. User Accounts", href: "#section-4" },
    { id: "5", title: "5. User Responsibilities", href: "#section-5" },
    { id: "6", title: "6. Independent Contractor Relationship", href: "#section-6" },
    { id: "7", title: "7. Off-Platform Engagements", href: "#section-7" },
    { id: "8", title: "8. Non-Circumvention (Limited – MVP Version)", href: "#section-8" },
    { id: "9", title: "9. Verified Talent Disclaimer", href: "#section-9" },
    { id: "10", title: "10. Intellectual Property", href: "#section-10" },
    { id: "11", title: "11. AI Functionality Disclaimer", href: "#section-11" },
    { id: "12", title: "12. Prohibited Use & Compliance", href: "#section-12" },
    { id: "13", title: "13. Limitation of Liability", href: "#section-13" },
    { id: "14", title: "14. Indemnification", href: "#section-14" },
    { id: "15", title: "15. Dispute Resolution (UPGRADED)", href: "#section-15" },
    { id: "16", title: "16. Termination", href: "#section-16" },
    { id: "17", title: "17. Changes to Terms", href: "#section-17" },
    { id: "18", title: "18. Contact", href: "#section-18" },
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
              Legal Agreement
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              Terms of Service
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Effective Date: May 5, 2026</span>
              <span>|</span>
              <span>Last Updated: May 5, 2026</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Table of Contents - Sticky on desktop */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 hidden lg:block">
              <h2 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white mb-6 uppercase">
                Contents
              </h2>
              <nav>
                <ul className="space-y-3">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#C2185B] transition-colors"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="max-w-3xl bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-pink-500/5 border border-zinc-100 dark:border-zinc-800">
              {/* Mobile TOC */}
              <div className="lg:hidden mb-10">
                <h2 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white mb-4 uppercase">
                  Contents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[#C2185B] transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Section 1 */}
              <section id="section-1" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">1. Acceptance of Terms</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  By accessing or using Kairos Nexus Global (“Kairos,” “we,” “us,” or “our”) through kairosng.com or related services (the “Platform”), you agree to be bound by these Terms of Service (“Terms”).
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  If you do not agree, you must not use the Platform.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  You represent that you are at least 18 years old and legally capable of entering a binding agreement.
                </p>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">2. Nature of the Platform (CRITICAL)</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos Nexus Global is a digital introduction and discovery platform that connects businesses with independent professionals (“Talent”).
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos does not currently:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Facilitate or process payments between users</li>
                  <li>Provide escrow services</li>
                  <li>Act as a party to contracts between users</li>
                  <li>Control or supervise work performed by Talent</li>
                  <li>Guarantee that any engagement will occur</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  All agreements, payments, and work arrangements occur entirely outside of the Platform unless explicitly stated otherwise in future updates.
                </p>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">3. Future Features Disclaimer</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may introduce features such as:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Integrated payments</li>
                  <li>Escrow services</li>
                  <li>AI-assisted matching or contract generation</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  These features will be governed by separate or updated terms when implemented.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  No such features are currently active unless explicitly stated on the Platform.
                </p>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">4. User Accounts</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users must provide accurate and complete information.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  You are responsible for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Maintaining account confidentiality</li>
                  <li>All activity under your account</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may suspend or terminate accounts for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>False information</li>
                  <li>Fraud or abuse</li>
                  <li>Risk to platform integrity</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">5. User Responsibilities</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users agree to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Provide accurate information</li>
                  <li>Act in good faith</li>
                  <li>Honor agreements made with other users</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users must not:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Misrepresent identity or qualifications</li>
                  <li>Engage in fraud or deception</li>
                  <li>Use the platform for illegal activity</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="section-6" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">6. Independent Contractor Relationship</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  All Talent are independent contractors.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Does not employ Talent</li>
                  <li>Does not direct or control work</li>
                  <li>Does not set hours, pricing, or deliverables</li>
                  <li>Is not responsible for taxes, benefits, or employment obligations</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users are solely responsible for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Determining working relationships</li>
                  <li>Complying with applicable labor and tax laws</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="section-7" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">7. Off-Platform Engagements</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  All interactions, agreements, and transactions between users currently occur outside the Platform.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Does not monitor off-platform communications</li>
                  <li>Is not responsible for any agreements made</li>
                  <li>Does not enforce payment or performance</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users assume full responsibility for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Negotiating terms</li>
                  <li>Executing contracts</li>
                  <li>Managing payments</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="section-8" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">8. Non-Circumvention (Limited – MVP Version)</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users agree not to exploit the Platform in bad faith to avoid fair use of Kairos services.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  However, due to the current structure of the Platform:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Kairos does not control or process transactions</li>
                  <li>Users may communicate and transact independently</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Kairos reserves the right to introduce stricter non-circumvention enforcement if transaction infrastructure is implemented.
                </p>
              </section>

              {/* Section 9 */}
              <section id="section-9" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">9. Verified Talent Disclaimer</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Verification is based on internal processes (e.g., identity checks, credentials).
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos does not guarantee:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Accuracy of user-provided information</li>
                  <li>Quality of work</li>
                  <li>Reliability or outcomes</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Users must conduct their own due diligence.
                </p>
              </section>

              {/* Section 10 */}
              <section id="section-10" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">10. Intellectual Property</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users retain ownership of their content.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos is granted a limited license to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Display</li>
                  <li>Distribute</li>
                  <li>Operate platform functionality</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos does not control or assign ownership of work created between users.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Users are responsible for defining ownership terms in their agreements.
                </p>
              </section>

              {/* Section 11 */}
              <section id="section-11" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">11. AI Functionality Disclaimer</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may use AI systems to assist with:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Matching</li>
                  <li>Recommendations</li>
                  <li>Platform operations</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  AI outputs:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Are informational only</li>
                  <li>Do not constitute legal, financial, or contractual advice</li>
                  <li>Must not be relied upon without independent verification</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section id="section-12" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">12. Prohibited Use & Compliance</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Users may not:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Engage in fraud, money laundering, or illegal activity</li>
                  <li>Use the platform in violation of sanctions or export control laws</li>
                  <li>Misuse personal or sensitive data</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos reserves the right to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Suspend accounts</li>
                  <li>Report unlawful activity</li>
                  <li>Cooperate with authorities</li>
                </ul>
              </section>

              {/* Section 13 */}
              <section id="section-13" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">13. Limitation of Liability</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  To the fullest extent permitted by law, Kairos shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>User disputes</li>
                  <li>Off-platform agreements</li>
                  <li>Financial losses or damages</li>
                  <li>Failure of engagements</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Total liability shall not exceed fees paid to Kairos (if any) within the last 12 months.
                </p>
              </section>

              {/* Section 14 */}
              <section id="section-14" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">14. Indemnification</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Users agree to indemnify Kairos against claims arising from:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mt-4">
                  <li>Use of the platform</li>
                  <li>Violations of these Terms</li>
                  <li>Disputes with other users</li>
                </ul>
              </section>

              {/* Section 15 */}
              <section id="section-15" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">15. Dispute Resolution (UPGRADED)</h2>
                <h3 className="text-lg font-bold dark:text-white mb-2">Step 1: Good Faith Negotiation</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Parties agree to attempt to resolve disputes through good faith negotiation for at least 30 days.
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">Step 2: Informal Resolution</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  If unresolved, parties may attempt mediation or informal settlement.
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">Step 3: Binding Arbitration</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  If still unresolved, disputes shall be resolved by binding arbitration in New York, USA, under recognized arbitration rules.
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>No class actions permitted</li>
                  <li>Arbitration decision is final and binding</li>
                </ul>
              </section>

              {/* Section 16 */}
              <section id="section-16" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">16. Termination</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may suspend or terminate access:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>With or without notice</li>
                  <li>For violations or risk</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Users may terminate at any time.
                </p>
              </section>

              {/* Section 17 */}
              <section id="section-17" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">17. Changes to Terms</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may update these Terms.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Continued use constitutes acceptance.
                </p>
              </section>

              {/* Section 18 */}
              <section id="section-18" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">18. Contact</h2>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    info@kairosnexusglobal.com
                  </p>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
