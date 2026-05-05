"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Globe, Award, Building, Users, Target, Shield, TrendingDown, CheckCircle2 } from "lucide-react";

// Custom LinkedIn Icon (not available in this lucide-react version)
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function AboutClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coFounders = [
    {
      name: "Jubelo Oyeniran",
      role: "Co-Founder & CEO",
      bio: "Focused on building a trusted path between ambitious talent and serious global opportunities. Leading Kairos with a vision to democratize access to quality remote work across borders.",
      image: "/Jubelo.jpeg",
      linkedin: "https://www.linkedin.com/in/jubelooyeniran/",
      twitter: "https://x.com/jubelooyeniran",
    },
    {
      name: "Ayorinde Alase",
      role: "Co-Founder & CTO",
      bio: "Bringing product and intelligent matching thinking to help talent find higher-quality roles faster. Architecting the AI and vetting systems that make Kairos different from ordinary job boards.",
      image: "/Ayorinde.jfif",
      linkedin: "https://www.linkedin.com/in/ayorinde-alase/",
      website: "https://www.ayoalase.com",
    },
  ];

  const trustPartners = [
    { name: "Jobberman", icon: Building, description: "Africa's leading job platform partnership" },
    { name: "PluralCode", icon: Users, description: "Technical training and certification alliance" },
    { name: "TEDCO", icon: Award, description: "Maryland's economic development catalyst" },
    { name: "Howard University", icon: Globe, description: "PNC Center for Entrepreneurship" },
  ];

  const awards = [
    "Pava Innovation Award recipient",
    "Spark Impact Award recipient",
    "Howard University PNC Center, 1st Place Pitch Competition",
    "TEDCO Build Regional Challenge Grant",
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
              Who We Are
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight mb-6">
              About Kairos
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
              Built on trust. Governed by principle. We&apos;re reimagining how global talent connects with serious opportunity.
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#F8F3F5] dark:from-zinc-900 to-white dark:to-zinc-950 rounded-[3rem] p-10 lg:p-16 border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl lg:text-3xl font-bold dark:text-white mb-6">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg mb-6">
              Kairos was founded to solve a fundamental problem: talented professionals outside the U.S. struggle to access serious remote work, while U.S. businesses overpay for talent and face endless hiring friction.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              We bridge that gap, connecting U.S. companies with pre-vetted global experts, delivering up to 70% cost savings without compromising quality. We don't just list jobs. We verify talent, structure opportunities, and protect both sides with enterprise-grade security and compliance.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">What Makes Us Different</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              We&apos;re not another freelance marketplace. Every part of Kairos is designed to reduce risk and increase quality for both sides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Verified Talent Only",
                desc: "Every professional undergoes identity verification, skill assessment, and case study review before they can apply to roles.",
                icon: Shield,
              },
              {
                title: "Quality Over Quantity",
                desc: "We curate roles and match based on capability, not just resumes. Case studies and real work samples drive selection.",
                icon: Target,
              },
              {
                title: "Built for Serious Work",
                desc: "Focus on long-term engagements and project-based work with clear expectations, not random gigs or low-budget tasks.",
                icon: CheckCircle2,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[#C2185B]/10 rounded-2xl mb-6 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-[#C2185B]" />
                </div>
                <h3 className="font-bold text-xl mb-4 dark:text-white">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust & Credibility */}
        <section className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">Trusted By Builders. Backed By Institutions.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              We've earned the trust of leading organizations and award committees that recognize our commitment to quality, innovation, and impact.
            </p>
          </div>

          {/* Awards */}
          <div className="mb-12">
            <h3 className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white mb-6 uppercase">Awards & Recognition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                >
                  <div className="w-10 h-10 bg-[#C2185B]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#C2185B]" />
                  </div>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{award}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Organizations */}
          <div>
            <h3 className="text-sm font-bold tracking-widest text-zinc-900 dark:text-white mb-6 uppercase">Partner Organizations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustPartners.map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-3 flex items-center justify-center">
                    <partner.icon className="w-6 h-6 text-[#C2185B]" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 dark:text-white">{partner.name}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Co-Founders */}
        <section className="mb-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">Meet the Founders</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Built by operators who understand both the challenges of global hiring and the potential of distributed talent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coFounders.map((founder) => (
              <div
                key={founder.name}
                className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-pink-100 dark:border-pink-900/30">
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold dark:text-white mb-1">{founder.name}</h3>
                    <p className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-4">{founder.role}</p>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">{founder.bio}</p>
                    <div className="flex items-center gap-4">
                      <a
                        href={founder.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 hover:text-[#0077B5] dark:hover:text-[#0077B5] transition-colors"
                      >
                        <LinkedinIcon className="w-5 h-5" />
                      </a>
                      {founder.twitter && (
                        <a
                          href={founder.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 hover:text-[#1DA1F2] dark:hover:text-[#1DA1F2] transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {founder.website && (
                        <a
                          href={founder.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 hover:text-[#C2185B] dark:hover:text-[#C2185B] transition-colors"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Trust First", desc: "Every feature, policy, and decision starts with: does this build or erode trust?" },
              { title: "Quality Over Growth", desc: "We'd rather serve 1000 exceptional users than 100,000 mediocre ones." },
              { title: "Global Mindset", desc: "Built for borderless opportunity, with local compliance wherever we operate." },
              { title: "Operational Excellence", desc: "Security, compliance, and governance aren't checkboxes, they're the foundation." },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800"
              >
                <h3 className="font-bold text-xl mb-3 dark:text-white">{value.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-4xl mx-auto bg-zinc-900 dark:bg-zinc-950 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-zinc-800/50">
          <div className="relative z-10 text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">Ready to join the ecosystem?</h2>
            <p className="text-zinc-400 text-lg">Whether you're seeking talent or seeking work, Kairos is built for you.</p>
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
