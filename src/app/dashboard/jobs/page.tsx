"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Filter,
  ChevronRight,
  Plus,
  Briefcase,
  Calendar,
  Users,
  Eye,
  Edit,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { getRecruiterJobs, type RecruiterJob } from "@/lib/api";

export default function JobsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posted-by-me");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);

  const statuses = [
    { id: "all", label: "All" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Draft" },
    { id: "archive", label: "Archive" },
    { id: "closed", label: "Closed" },
  ];

  const tabs = [
    { id: "posted-by-me", label: "Jobs posted by me" },
    { id: "other-listings", label: "Other Job listings" },
  ];

  useEffect(() => {
    async function loadJobs() {
      if (!user) return;
      try {
        setLoading(true);
        const response = await getRecruiterJobs({ page: 1, limit: 50 });
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
  }, [user]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-[#C2185B] rounded-2xl p-6 lg:p-8 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Manage your job postings</h1>
              <p className="mt-2 text-white/80">
                View and manage all your job postings in one place.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2185B]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header Section */}
      <div className="bg-[#C2185B] rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">
              Manage your job postings and find the best talent.
            </h1>
            <p className="mt-2 text-white/80 text-lg">
              View and manage all your job postings in one place.
            </p>
          </div>
          <Link
            href="/dashboard/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2185B]/50 border border-white/30 rounded-xl hover:bg-[#C2185B]/70 transition-colors"
          >
            Post a job
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[#C2185B] text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          Explore talent pool
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-4 lg:p-6 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, role, or skill"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Location"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30"
            />
          </div>
          <button className="px-6 py-4 bg-[#C2185B] rounded-2xl text-white hover:bg-[#A3154D] transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status.id
                  ? "bg-[#C2185B] text-white"
                  : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      {filteredJobs.length > 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-[#C2185B] mr-3" />
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {job.title}
                          </div>
                          {job.compensation && (
                            <div className="text-sm text-zinc-500">
                              {job.compensation}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {job.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {job.locationType || "Remote"}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {job.type || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/post-job?id=${job.id}`}
                          className="text-zinc-600 hover:text-[#C2185B] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 border border-zinc-200 dark:border-zinc-800 text-center">
          <div className="mb-6">
            <svg
              className="w-32 h-32 mx-auto text-zinc-200 dark:text-zinc-700"
              viewBox="0 0 200 200"
              fill="none"
            >
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" />
              <path
                d="M70 80 Q100 60 130 80"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M75 100 H125"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M85 120 H115"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="130" cy="65" r="25" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-zinc-500 mb-6">
            Create your first job posting to start attracting talent
          </p>
          <Link
            href="/dashboard/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C2185B] text-white rounded-xl hover:bg-[#A3154D] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post Your First Job
          </Link>
        </div>
      )}
    </div>
  );
}