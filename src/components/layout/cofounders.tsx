import { Globe } from "lucide-react";

type Founder = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  twitter?: string | null;
  website?: string;
};

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

const coFounders: Founder[] = [
  {
    name: "Jubelo Oyeniran",
    role: "Co-Founder",
    bio: "Award-winning Stevenson University graduate and SU Pin Award recipient (valedictorian equivalent), Jubelo is a CPA candidate pursuing a master's in forensic accounting. He brings 3+ years of audit and consulting experience across Citrin Cooperman and Clearview Group, is a 2× national Johns Hopkins consulting case competition winner, built a $105K business at 17, has been featured by the NFL, and previously served as SGA President.",
    image: "/Jubelo.jpeg",
    linkedin: "https://www.linkedin.com/in/jubelooyeniran/",
    twitter:null,
  },
  {
    name: "Ayorinde Alase",
    role: "Co-Founder",
    bio: "Doctoral candidate in Computer Engineering at University of Arkansas, Little Rock, with 3+ years building AI products. Former digital solutions developer at AXA, specializing in machine learning for insurance and healthcare. Expert in Python, deep learning, and algorithm development driving innovation in global tech solutions.",
    image: "/Ayorinde.jfif",
    linkedin: "https://www.linkedin.com/in/ayorinde-alase/",
    website: "https://www.ayoalase.com",
  },
];

export function Cofounders() {
  return (
    <section className="py-24" suppressHydrationWarning>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-4 block">
            Meet the Team
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold dark:text-white mb-6">
            Meet the Founders
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Built by operators who understand both the challenges of global hiring and the potential of distributed talent.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {coFounders.map((founder, index) => (
            <div
              key={`founder-${index}`}
              className="bg-white dark:bg-zinc-900 p-8 lg:p-10 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-pink-100 dark:border-pink-900/30">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold dark:text-white mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-4">
                    {founder.role}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {founder.bio}
                  </p>
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
      </div>
    </section>
  );
}
