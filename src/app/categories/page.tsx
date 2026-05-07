"use client";

import { useState, useMemo } from "react";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { categories as allCategories } from "@/lib/api";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => ["All", ...Array.from(new Set(allCategories.map(c => c.tag)))], []);

  const filteredCategories = useMemo(() => {
    return allCategories.filter(category =>
      (category.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       category.desc.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedTag === "All" || category.tag === selectedTag)
    );
  }, [searchQuery, selectedTag]);
   
 

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-[#C2185B] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-2 block">Hire the best</span>
              <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight">Expertise in every domain</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl text-lg">
                Explore our curated domains of pre-vetted experts ready to scale your remote team.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 mb-12 shadow-xl shadow-pink-500/5 border border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col gap-6">
            {/* Search Input - Own Block */}
            <div className="flex items-center gap-3 pl-4 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50">
              <Search className="w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search domains or expertise..."
                className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-white placeholder:text-zinc-400 py-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Tags - Separate Block */}
            <div className="flex flex-wrap gap-2 items-center px-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedTag === tag 
                      ? "bg-[#C2185B] text-white shadow-lg shadow-pink-500/20" 
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <a
                key={category.id}
                href="https://app.kairosng.com/auth/login"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:-translate-y-1 transition-all group block"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/10 rounded-2xl flex items-center justify-center group-hover:bg-[#C2185B] transition-colors">
                    <category.icon className="w-7 h-7 text-[#C2185B] group-hover:text-white transition-colors" />
                  </div>
                  <span className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-zinc-100 dark:border-zinc-700">
                    {category.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white group-hover:text-[#C2185B] transition-colors">{category.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">{category.desc}</p>
                <div className="flex justify-between items-center mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-800">
                  <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{category.count}</span>
                  <span className="flex items-center gap-2 text-[#C2185B] font-bold text-sm group-hover:gap-3 transition-all">
                    Hire talent <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-zinc-300 dark:text-zinc-600" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">No categories found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedTag("All");}}
                className="mt-8 text-[#C2185B] font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-[#1A1A1A] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">Can&apos;t find the specific role you need?</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our team can help you source specialized talent for your unique business requirements.
            </p>
          </div>
          <button className="relative z-10 bg-[#C2185B] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#A3154D] transition-all shadow-xl shadow-pink-500/20 cursor-pointer">
            Talk to an expert
          </button>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C2185B] opacity-10 blur-[100px] -mr-48 -mt-48" />
        </div>
      </div>
    </div>
  );
}
