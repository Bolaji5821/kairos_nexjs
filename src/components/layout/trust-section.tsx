import React from "react";

export function TrustSection() {
  const partners = [
    { name: "Jobberman", logo: "/jobberman.png" },
    { name: "PluralCode", logo: "/pluralcode.png" },
    { name: "Maryland TEDCO", logo: "/tedco.png" },
  ];

  const awards = [
    { name: "Pava Innovation", logo: "/pava.png" },
    { name: "Spark Impact", logo: "/spark_baltimore.png" },
    { name: "Howard University PNC", logo: "/howard_pnc.png" },
  ];

  // Double the arrays for seamless marquee loop
  const marqueePartners = [...partners, ...partners, ...partners, ...partners];
  const marqueeAwards = [...awards, ...awards, ...awards, ...awards];

  return (
    <section className="py-24 border-y border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-2 block">Our Credibility</span>
          <h2 className="text-3xl md:text-4xl font-bold dark:text-white">Trusted By Builders. Backed By Institutions.</h2>
        </div>
      </div>

      <div className="space-y-12">
        {/* Partners Marquee */}
        <div className="flex flex-col gap-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-center">Strategic Partners & Backers</h3>
          </div>
          <div className="marquee-container">
            <div className="animate-marquee py-4">
              {marqueePartners.map((partner, index) => (
                <div 
                  key={`${partner.name}-${index}`} 
                  className="flex items-center justify-center px-6 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                >
                  <div className="bg-[#FFF8FB] dark:bg-white p-4 rounded-[1.5rem] shadow-sm border border-zinc-100 dark:border-zinc-200 flex items-center justify-center min-w-[160px] h-20">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="h-8 sm:h-10 w-auto object-contain max-w-[120px]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards Marquee */}
        <div className="flex flex-col gap-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-center">Recognition & Awards</h3>
          </div>
          <div className="marquee-container">
            <div className="animate-marquee-reverse py-4">
              {marqueeAwards.map((award, index) => (
                <div 
                  key={`${award.name}-${index}`} 
                  className="flex items-center justify-center px-6 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100"
                >
                  <div className="bg-[#FFF8FB] dark:bg-white p-4 rounded-[1.5rem] shadow-sm border border-zinc-100 dark:border-zinc-200 flex items-center justify-center min-w-[160px] h-20">
                    <img 
                      src={award.logo} 
                      alt={award.name} 
                      className="h-8 sm:h-10 w-auto object-contain max-w-[120px]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
