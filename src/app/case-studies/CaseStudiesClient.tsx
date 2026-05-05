"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, TrendingDown, Award, Globe } from "lucide-react";

export function CaseStudiesClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseStudies = [
    {
      id: "talent-success",
      type: "Talent Success Story",
      title: "From Discovery to Dream Role in 14 Days",
      subtitle: "How Sarah landed a $4,200/month remote role with a U.S. SaaS company",
      story: [
        "Sarah, a product designer from Nigeria, had spent 8 months applying to random job boards with little response. She joined Kairos in January.",
        "After completing a 2-hour case study showcasing her Figma expertise and design thinking, she was matched with a growing SaaS startup.",
        "Within 14 days, she was hired at $4,200/month, 3x her previous rate, fully remote with U.S. team hours.",
        "Sarah's case study is now part of our talent showcase, helping her attract even better opportunities.",
      ],
      metrics: [
        { label: "Time to Hire", value: "14 days" },
        { label: "Salary Increase", value: "3x" },
        { label: "Case Study Completion", value: "2 hours" },
      ],
      icon: Target,
    },
    {
      id: "company-success",
      type: "Company Success Story",
      title: "Hiring a World-Class Engineer at 60% Cost Savings",
      subtitle: "How a fintech startup found their senior frontend engineer through Kairos",
      story: [
        "A fast-growing fintech startup needed a senior frontend engineer but struggled with local hiring costs and lengthy processes.",
        "They posted on Kairos and received 5 pre-vetted candidates within 48 hours, each with verified skills and case studies.",
        "They hired David from Kenya, a proven engineer with 6 years of React experience, at $3,800/month versus the $9,500 local market rate.",
        "The startup saved over $68,000 in annual personnel costs while getting a higher-quality candidate than they expected.",
      ],
      metrics: [
        { label: "Cost Savings", value: "60%" },
        { label: "Candidates Received", value: "5 vetted" },
        { label: "Time to Fill", value: "10 days" },
      ],
      icon: TrendingDown,
    },
    {
      id: "quality-focus",
      type: "Our Approach",
      title: "Why Case Studies Beat Resumes Every Time",
      subtitle: "How real work samples reveal capability that paper qualifications never will",
      story: [
        "Resumes tell you where someone has been. Case studies show you what they can do.",
        "Every Kairos talent completes a short, relevant case study during onboarding, proving their skills with real work, not just listing them.",
        "For companies, this means you're evaluating actual ability, not just impressive job titles and buzzwords.",
        "The result: better matches, higher satisfaction, and long-term success for both sides.",
      ],
      metrics: [
        { label: "Hiring Accuracy", value: "87%" },
        { label: "Match Quality Score", value: "4.8 / 5" },
        { label: "Avg. Case Study Time", value: "2–3 hrs" },
      ],
      icon: Award,
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
              Quality in Action
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              Case Studies
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Real stories from real users. See how Kairos delivers on our promises of quality, speed, and cost savings.
            </p>
          </div>
        </div>

        {/* Case Studies */}
        <div className="max-w-4xl mx-auto space-y-16">
          {caseStudies.map((caseStudy, idx) => (
            <section key={caseStudy.id} id={caseStudy.id} className="scroll-mt-24">
              {/* Header */}
              <div className="mb-8">
                <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-2 block">{caseStudy.type}</span>
                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-2">{caseStudy.title}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg">{caseStudy.subtitle}</p>
              </div>

              {/* Story */}
              <div className="bg-zinc-50 dark:bg-zinc-900 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 mb-8">
                <div className="space-y-4">
                  {caseStudy.story.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm text-center"
                  >
                    <div className="text-3xl lg:text-4xl font-bold text-[#C2185B] mb-2">{metric.value}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800/50">
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Ready to write your own case study?</h2>
            <p className="text-zinc-400 text-lg">Join hundreds of companies and talent already using Kairos.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/10 transition-colors text-center"
            >
              Join as Talent
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl font-bold bg-[#C2185B] text-white hover:bg-[#A3154D] transition-colors text-center"
            >
              Start Hiring
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2185B] opacity-10 blur-[80px] -mr-32 -mt-32" />
        </div>
      </div>
    </div>
  );
}
