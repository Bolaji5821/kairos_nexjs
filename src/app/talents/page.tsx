"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ArrowLeft, MapPin, Briefcase, Star, Clock, ArrowRight, User, Award, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPublicTalents, PublicTalent } from "@/lib/api";

export default function TalentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [publicTalents, setPublicTalents] = useState<PublicTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPublicTalents = async () => {
      try {
        const response = await getPublicTalents();
        setPublicTalents(response.data);
      } catch (error) {
        console.error("Failed to fetch public talents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicTalents();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const skills = useMemo(() => ["All", ...Array.from(new Set(publicTalents.flatMap(t => t.skills || [])))], [publicTalents]);
  const experienceLevels = useMemo(() => ["All", ...Array.from(new Set(publicTalents.map(t => t.experienceLevel)))], [publicTalents]);

  const filteredTalents = useMemo(() => {
    return publicTalents.filter(talent => 
      (talent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
       talent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       talent.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (talent.skills && talent.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))) &&
      (selectedSkills === "All" || (talent.skills && talent.skills.includes(selectedSkills))) &&
      (selectedExperience === "All" || talent.experienceLevel === selectedExperience)
    );
  }, [searchQuery, selectedSkills, selectedExperience, publicTalents]);

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
              <span className="text-[#C2185B] font-bold text-xs uppercase tracking-widest mb-2 block">Global Talent</span>
              <h1 className="text-4xl lg:text-6xl font-bold dark:text-white leading-tight">Discover exceptional talent</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl text-lg">
                Browse our network of pre-vetted professionals ready to join your team.
              </p>
            </div>
            <div className="text-sm text-zinc-500">
              {publicTalents.length} talented professionals available
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 mb-12 shadow-xl shadow-pink-500/5 border border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="flex items-center gap-3 pl-6 pr-2 py-2 border border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50">
              <Search className="w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search by name, skills, or expertise..."
                className="w-full bg-transparent border-none focus:ring-0 text-zinc-900 dark:text-white placeholder:text-zinc-400 py-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="hidden sm:block bg-[#C2185B] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#A3154D] transition-all"
              >
                Search Jobs
              </button>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {skills.slice(0, 10).map((skill, index) => (
                    <button
                      key={`${skill}-${index}`}
                      onClick={() => setSelectedSkills(skill)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedSkills === skill 
                          ? "bg-[#C2185B] text-white shadow-md shadow-pink-500/10" 
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Experience</span>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedExperience(level)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedExperience === level 
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md" 
                          : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Talents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/5"></div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-16"></div>
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-20"></div>
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-14"></div>
                </div>
              </div>
            ))
          ) : filteredTalents.length > 0 ? (
            filteredTalents.map((talent) => (
              <Link key={talent.id} href={`/talents/${talent.id}`} className="block">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-lg hover:border-pink-100 dark:hover:border-pink-900/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    {talent.profilePicture ? (
                      <img 
                        src={talent.profilePicture} 
                        alt={`${talent.firstName} ${talent.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/10 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-[#C2185B]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold dark:text-white group-hover:text-[#C2185B] transition-colors">
                        {talent.firstName} {talent.lastName}
                      </h3>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        {talent.jobTitles[0]}
                      </p>
                    </div>
                  </div>

                  {talent.bio && (
                    <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">
                      {talent.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {talent.skills?.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {talent.skills && talent.skills.length > 4 && (
                      <span className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs rounded-full">
                        +{talent.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {talent.location || 'Remote'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        {talent.experienceLevel}
                      </div>
                    </div>

                    <span className="text-[#C2185B] font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Profile <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">No talents found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Try adjusting your search criteria or check back later for new talent.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}