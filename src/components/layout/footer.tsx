"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const socialLinks = [
    { name: "Instagram", href: "https://www.instagram.com/kairosnexus?igsh=ZDh3NTYyazgycXJ2", icon: FaInstagram },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/kairosnexus/", icon: FaLinkedin },
    { name: "X", href: "https://x.com/kairos_nexus?s=21", icon: FaXTwitter },
  ];

  const sections = [
    {
      title: "PLATFORM",
      links: [
        { name: "For Businesses", href: "/for-business" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Hire Talent", href: "/hire-talent" },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Security", href: "/security" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "LEGAL",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Data Governance", href: "/privacy-policy#section-9" },
        { name: "Cookie Policy", href: "/privacy-policy#section-13" },
      ],
    },
  ];

  return (
    <footer className="bg-transparent pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo & Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Kairos Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold dark:text-white">Kairos</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed mb-6">
              The premium bridge for companies hiring exceptional remote talent with more speed, confidence, and cost efficiency.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-[#C2185B] hover:text-white transition-all hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold tracking-widest text-gray-900 dark:text-white mb-6 uppercase">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 text-center md:text-left">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Kairos. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
