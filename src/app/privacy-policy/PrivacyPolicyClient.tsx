"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PrivacyPolicyClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tableOfContents = [
    { id: "1", title: "1. Introduction", href: "#section-1" },
    { id: "2", title: "2. Scope of This Policy", href: "#section-2" },
    { id: "3", title: "3. Information We Collect", href: "#section-3" },
    { id: "4", title: "4. What We Do NOT Currently Do (Important)", href: "#section-4" },
    { id: "5", title: "5. How We Use Information", href: "#section-5" },
    { id: "6", title: "6. Legal Basis for Processing", href: "#section-6" },
    { id: "7", title: "7. Data Sharing", href: "#section-7" },
    { id: "8", title: "8. Cross-Border Data Transfers", href: "#section-8" },
    { id: "9", title: "9. Data Security", href: "#section-9" },
    { id: "10", title: "10. Data Retention", href: "#section-10" },
    { id: "11", title: "11. AI-Assisted Processing", href: "#section-11" },
    { id: "12", title: "12. User Rights", href: "#section-12" },
    { id: "13", title: "13. Cookies and Tracking", href: "#section-13" },
    { id: "14", title: "14. Children’s Privacy", href: "#section-14" },
    { id: "15", title: "15. Security Incidents & Breach Notification", href: "#section-15" },
    { id: "16", title: "16. International Compliance", href: "#section-16" },
    { id: "17", title: "17. Updates to This Policy", href: "#section-17" },
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
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#C2185B]/10 text-[#C2185B] text-xs font-bold uppercase tracking-widest rounded-full border border-[#C2185B]/20">
                GDPR Compliant
              </span>
              <span className="px-3 py-1 bg-[#C2185B]/10 text-[#C2185B] text-xs font-bold uppercase tracking-widest rounded-full border border-[#C2185B]/20">
                CCPA / CPRA
              </span>
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                NDPR Compliant
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              Privacy Policy
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
                <h2 className="text-2xl font-bold dark:text-white mb-4">1. Introduction</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos Nexus Global (“Kairos,” “we,” “us,” or “our”) is a digital platform that connects businesses with independent professionals globally.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We are committed to protecting personal data, maintaining transparency, and operating in compliance with applicable data protection laws.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              {/* Section 2 */}
              <section id="section-2" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">2. Scope of This Policy</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  This Policy applies to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Users of the Kairos platform</li>
                  <li>Visitors to kairosng.com</li>
                  <li>Individuals interacting with our services</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  It applies regardless of location, subject to applicable law.
                </p>
              </section>

              {/* Section 3 */}
              <section id="section-3" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">3. Information We Collect</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We collect the following categories of data:
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">A. Account Information</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mb-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Profile details</li>
                </ul>
                <h3 className="text-lg font-bold dark:text-white mb-2">B. Identity Verification Data</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mb-4">
                  <li>Government-issued identification</li>
                  <li>Verification identifiers (e.g., NIN or equivalent)</li>
                </ul>
                <h3 className="text-lg font-bold dark:text-white mb-2">C. Professional Information</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mb-4">
                  <li>Skills</li>
                  <li>Work history</li>
                  <li>Portfolio content</li>
                </ul>
                <h3 className="text-lg font-bold dark:text-white mb-2">D. Usage Data</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mb-4">
                  <li>Platform activity</li>
                  <li>Device and browser information</li>
                  <li>Log data</li>
                </ul>
                <h3 className="text-lg font-bold dark:text-white mb-2">E. Communications</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4 mb-4">
                  <li>Messages sent to Kairos support</li>
                  <li>Platform-related inquiries</li>
                </ul>
                <h3 className="text-lg font-bold dark:text-white mb-2">F. Third-Party Data</h3>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Data provided through integrations or partners (if applicable)</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="section-4" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">4. What We Do NOT Currently Do (Important)</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  As of the Effective Date:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Kairos does not directly process or store payment card information</li>
                  <li>Kairos does not facilitate escrow transactions</li>
                  <li>Kairos does not execute or enforce contracts between users</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  If such features are introduced, this Policy will be updated accordingly.
                </p>
              </section>

              {/* Section 5 */}
              <section id="section-5" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">5. How We Use Information</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We use data to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Operate and maintain the Platform</li>
                  <li>Enable user discovery and matching</li>
                  <li>Verify identity and reduce fraud</li>
                  <li>Improve platform functionality</li>
                  <li>Communicate with users</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="section-6" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">6. Legal Basis for Processing</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Where required, we process data under:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Contractual necessity</li>
                  <li>Legitimate interests (platform operation, fraud prevention)</li>
                  <li>Legal obligations</li>
                  <li>User consent (where applicable)</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="section-7" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">7. Data Sharing</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We may share data with:
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">A. Service Providers</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Infrastructure, analytics, and operational partners.
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">B. Verification Providers</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Identity verification partners where applicable.
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">C. Legal Authorities</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Where required by law or to protect rights and safety.
                </p>
                <h3 className="text-lg font-bold dark:text-white mb-2">D. Business Transfers</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  In the event of merger, acquisition, or restructuring.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-bold">
                  We do not sell personal data.
                </p>
              </section>

              {/* Section 8 */}
              <section id="section-8" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">8. Cross-Border Data Transfers</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos operates internationally.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Your data may be transferred and processed in jurisdictions outside your country of residence, including the United States and other regions where we operate.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We implement safeguards such as:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Encryption</li>
                  <li>Access controls</li>
                  <li>Contractual protections where applicable</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="section-9" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">9. Data Security</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We implement reasonable administrative, technical, and organizational measures, including:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Encryption in transit and at rest</li>
                  <li>Role-based access control</li>
                  <li>Multi-factor authentication for sensitive access</li>
                  <li>Monitoring and logging</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  However, no system is completely secure.
                </p>
              </section>

              {/* Section 10 */}
              <section id="section-10" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">10. Data Retention</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We retain data:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>For as long as necessary to operate the Platform</li>
                  <li>To comply with legal obligations</li>
                  <li>Until deletion is requested, subject to legal retention requirements</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  Deletion requests are typically processed within 30 days.
                </p>
              </section>

              {/* Section 11 */}
              <section id="section-11" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">11. AI-Assisted Processing</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos may use AI systems to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Recommend users</li>
                  <li>Improve platform functionality</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  AI processing:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Is limited to operational purposes</li>
                  <li>Does not constitute automated decision-making with legal effect</li>
                  <li>Does not replace user judgment</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  We do not use personal data for external AI training without consent.
                </p>
              </section>

              {/* Section 12 */}
              <section id="section-12" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">12. User Rights</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Access your data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion</li>
                  <li>Object to processing</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  Requests can be made via: info@kairosnexusglobal.com
                </p>
              </section>

              {/* Section 13 */}
              <section id="section-13" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">13. Cookies and Tracking</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We use cookies and similar technologies for:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>Platform functionality</li>
                  <li>Analytics</li>
                  <li>Performance</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  Non-essential cookies are used only with user consent where required.
                </p>
              </section>

              {/* Section 14 */}
              <section id="section-14" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">14. Children’s Privacy</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The Platform is not intended for individuals under 18.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  We do not knowingly collect data from minors.
                </p>
              </section>

              {/* Section 15 */}
              <section id="section-15" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">15. Security Incidents & Breach Notification</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  In the event of a data breach affecting personal information:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>We will investigate and take appropriate remedial action</li>
                  <li>We will notify affected users where required by applicable law</li>
                  <li>Where applicable, notifications may occur within legally required timeframes (e.g., 72 hours under certain regulations)</li>
                </ul>
              </section>

              {/* Section 16 */}
              <section id="section-16" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">16. International Compliance</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Kairos aims to comply with applicable data protection laws, including:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 pl-4">
                  <li>General Data Protection Regulation (GDPR)</li>
                  <li>California Consumer Privacy Act (CCPA/CPRA)</li>
                  <li>Nigeria Data Protection Regulation (NDPR)</li>
                </ul>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-4">
                  Where conflicts arise, applicable law will govern.
                </p>
              </section>

              {/* Section 17 */}
              <section id="section-17" className="mb-12 scroll-mt-24">
                <h2 className="text-2xl font-bold dark:text-white mb-4">17. Updates to This Policy</h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                  Material changes will be communicated appropriately.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Continued use of the Platform constitutes acceptance.
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
