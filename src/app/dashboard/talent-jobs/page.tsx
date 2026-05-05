"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Filter, ChevronRight, Briefcase, Calendar, Users, Eye } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { getPublicJobs, type PublicJob } from "@/lib/api";

export default function TalentJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await getPublicJobs({ limit: 20 });
        if (response.data) {
          setJobs(response.data);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = locationTypeFilter === "all" || job.locationType === locationTypeFilter;
    const matchesJobType = jobTypeFilter === "all" || job.type === jobTypeFilter;
    
    return matchesSearch && matchesLocation && matchesJobType;
  });

  const locationTypes = ["all", "REMOTE", "ONSITE", "HYBRID"];
  const jobTypes = ["all", "FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2185B]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="bg-[#C2185B] rounded-2xl p-6 lg:p-8 text-white">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            Find Your Next Opportunity
          </h1>
          <p className="mt-2 text-white/80">
            Browse and apply to jobs that match your skills and aspirations
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-4 lg:p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by job title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <select
            value={locationTypeFilter}
            onChange={(e) => setLocationTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
          >
            {locationTypes.map(type => (
              <option key={type} value={type}>
                {type === "all" ? "All Locations" : type.replace("_", " ")}
              </option>
            ))}
          </select>
          
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
          >
            {jobTypes.map(type => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Available Jobs ({filteredJobs.length})
        </h2>
        
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-[#C2185B] transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{job.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{job.companyName}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span>{job.locationType?.replace("_", " ")}</span>
                      <span>{job.type?.replace("_", " ")}</span>
                      <span>{job.experienceLevel?.replace("_", " ")}</span>
                      {job.compensation && <span>{job.compensation}</span>}
                    </div>
                    
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 text-xs text-zinc-500">+{job.skills.length - 5} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="px-4 py-2 text-sm font-medium text-[#C2185B] border border-[#C2185B] rounded-lg hover:bg-[#C2185B]/10 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-zinc-200 dark:border-zinc-800 text-center">
            <Briefcase className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              No jobs found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}