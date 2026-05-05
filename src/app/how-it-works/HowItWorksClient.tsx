"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Users, CheckCircle2, ShieldCheck, UserCheck, Zap, TrendingDown, Brain, FileText, ClipboardList } from "lucide-react";

export function HowItWorksClient() {
  const [activeTab, setActiveTab] = useState<"talent" | "company">("talent");

  const talentSteps = [
    {
      step: "1",
      title: "Discover curated opportunities",
      desc: "Browse high-quality roles from U.S. businesses looking for global expertise. Filter by skills, pay, and working style.",
      icon: Search,
    },
    {
      step: "2",
      title: "Review role expectations",
      desc: "See clear requirements, compensation, team context, and must-have skills before you commit. No hidden expectations.",
      icon: CheckCircle2,
    },
    {
      step: "3",
      title: "Complete a short case study",
      desc: "Showcase your skills through real work samples. We value capability over just resumes, prove your expertise.",
      icon: ShieldCheck,
    },
    {
      step: "4",
      title: "Get matched with serious clients",
      desc: "Fast-track your way to interviews with clients who are ready to hire. We pre-vette, you close.",
      icon: UserCheck,
    },
  ];

  const companySteps = [
    {
      step: "Step 1",
      title: "Define the role",
      desc: "Set the role, seniority, budget, timezone, and must-have skills. Get a clear hiring brief in minutes.",
      icon: ClipboardList,
    },
    {
      step: "Step 2",
      title: "Review vetted talent",
      desc: "Focus on curated profiles already screened for quality and readiness. Skip the unqualified applicants.",
      icon: Users,
    },
    {
      step: "Step 3",
      title: "Interview and hire",
      desc: "Move quickly from shortlist to interviews and final decisions. We facilitate introduction, you make the call.",
      icon: Zap,
    },
  ];

  const whyTalentChooses = [
    { title: "Verified companies", desc: "Apply to roles from teams that are ready to hire and clear about expectations.", icon: ShieldCheck },
    { title: "Smarter filtering", desc: "Search by role, pay, tools, timezone, and working style to find stronger matches faster.", icon: Zap },
    { title: "More relevant roles", desc: "Spend less time sorting through noise and more time applying to jobs that fit your profile.", icon: TrendingDown },
    { title: "Global remote access", desc: "Connect with high-quality remote opportunities across product, support, and engineering roles.", icon: UserCheck },
  ];

  const whyCompaniesChoose = [
    { title: "Verified experts only", desc: "Skip unqualified applicants and focus on candidates already reviewed for capability and fit.", icon: UserCheck },
    { title: "Faster shortlists", desc: "Filter by role, seniority, availability, timezone, and working style to reach decisions sooner.", icon: Zap },
    { title: "Reduced hiring cost", desc: "Access exceptional global talent with a more efficient cost structure than traditional local hiring.", icon: TrendingDown },
    { title: "Hiring confidence", desc: "Every step is designed to help teams hire with more trust, clarity, and operational control.", icon: CheckCircle2 },
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
              Platform Process
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              How It Works
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              From discovery to hire, simplified. Learn how Kairos connects talent with opportunity, and how companies build stronger teams.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full inline-flex">
            <button
              onClick={() => setActiveTab("talent")}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "talent"
                  ? "bg-[#C2185B] text-white shadow-md shadow-pink-500/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              For Talent
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "company"
                  ? "bg-[#C2185B] text-white shadow-md shadow-pink-500/10"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              For Companies
            </button>
          </div>
        </div>

        {/* Talent Tab Content */}
        {activeTab === "talent" && (
          <div className="space-y-20 max-w-5xl mx-auto">
            {/* Hero / Intro */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-8">
                Discover remote jobs with transparent pay and clear expectations. Showcase your skills through case studies, get matched with companies ready to hire, and move from application to offer with confidence.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/jobs"
                  className="bg-[#C2185B] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/10"
                >
                  Find jobs
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#C2185B] transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {talentSteps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 transition-transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                      <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-3">
                        Step {item.step}
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-[#C2185B]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Why Section */}
            <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl font-bold dark:text-white text-center mb-10">
                Why Talent Chooses Kairos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyTalentChooses.map((feature, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-zinc-800 rounded-xl mb-6 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-[#C2185B]" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Company Tab Content */}
        {activeTab === "company" && (
          <div className="space-y-20 max-w-5xl mx-auto">
            {/* Hero / Intro */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-8">
                You can discover, evaluate, and hire better remote talent with less friction. From role definition to final hire, we streamline the process.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/categories"
                  className="bg-[#C2185B] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/10"
                >
                  Start hiring
                </Link>
                <Link
                  href="/"
                  className="px-8 py-4 rounded-2xl font-bold border border-zinc-200 dark:border-zinc-700 hover:border-[#C2185B] transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* For Hiring Teams Card */}
              <div className="bg-[#F8F3F5] dark:bg-zinc-900/50 p-8 lg:p-12 rounded-[2.5rem] flex flex-col">
                <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl mb-8 flex items-center justify-center shadow-sm">
                  <Users className="w-7 h-7 text-[#C2185B]" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-6 dark:text-white">For hiring teams</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed">
                  You can discover, evaluate, and hire better remote talent with less friction.
                </p>
                <div className="space-y-6 mb-12">
                  {[
                    "Shortlist talent by role, skills, seniority, and availability",
                    "Reduce screening overhead with pre-vetted candidates",
                    "Hire globally while keeping cost efficiency in view",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 flex-shrink-0 mt-1 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#C2185B]" />
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/categories"
                  className="bg-[#C2185B] text-white py-4 px-8 rounded-2xl font-bold hover:bg-[#A3154D] transition-colors w-fit"
                >
                  Start hiring
                </Link>
              </div>

              {/* How Hiring Works Card */}
              <div className="bg-[#1A1A1A] p-8 lg:p-12 rounded-[2.5rem] text-white">
                <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-4 block">
                  How hiring works
                </span>
                <h2 className="text-2xl lg:text-4xl font-bold mb-10 leading-tight">
                  From request to shortlist, simplified
                </h2>
                <div className="space-y-6">
                  {companySteps.map((item, idx) => (
                    <div key={idx} className="bg-zinc-800/50 p-6 rounded-2xl border border-white/5">
                      <span className="text-xs text-zinc-500 font-medium mb-1 block">{item.step}</span>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Section */}
            <div className="pt-12 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-3xl font-bold dark:text-white text-center mb-10">
                Why Companies Choose Kairos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyCompaniesChoose.map((feature, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-zinc-800 rounded-xl mb-6 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-[#C2185B]" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-24 max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800/50">
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Ready to get started?
            </h2>
            <p className="text-zinc-400 text-lg">
              Join hundreds of companies and talent already using Kairos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/10 transition-colors text-center"
            >
              Explore as Talent
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl font-bold bg-[#C2185B] text-white hover:bg-[#A3154D] transition-colors text-center"
            >
              Explore as Company
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2185B] opacity-10 blur-[80px] -mr-32 -mt-32" />
        </div>
      </div>
    </div>
  );
}
