"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Search,
  ChevronRight,
  Calendar,
  DollarSign,
  Eye,
  Edit,
} from "lucide-react";
import { getDashboardStats, getRecruiterJobs, type RecruiterJob, type DashboardStats } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    talentMatches: 0,
  });
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      // Only fetch recruiter jobs if user is a company
      const isCompany = user?.role === "COMPANY" || user?.role === "ADMIN" || user?.role === "SUPERADMIN";
      
      try {
        const [statsRes, jobsRes] = await Promise.all([
          getDashboardStats().catch(() => ({
            data: { totalJobs: 0, activeJobs: 0, totalApplicants: 0, talentMatches: 0 },
          })),
          isCompany 
            ? getRecruiterJobs({ page: 1, limit: 5 }).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);
      
        if (statsRes.data) setStats(statsRes.data);
        if (jobsRes.data) setJobs(jobsRes.data);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCompany = user?.role === "COMPANY" || user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pt-18 px-0">
      {/* Welcome Section */}
      <div className="bg-[#FCE4EC] rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900">
              Hi, {user?.firstName || "there"}!
            </h1>
            <p className="mt-2 text-zinc-600">
              {isCompany
                ? "Welcome back! Manage your job posts and find the best talent."
                : "Welcome back! Discover new opportunities and manage your career journey."}
            </p>
          </div>
        </div>
      </div>

      {isCompany ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Jobs</p>
                  <p className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.totalJobs}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#C2185B] to-pink-600">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Active Jobs</p>
                  <p className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.activeJobs}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#C2185B] to-[#A3154D]">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Applicants</p>
                  <p className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.totalApplicants}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Talent Matches</p>
                  <p className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">{stats.talentMatches}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Jobs Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Jobs</h2>
              <Link
                href="/dashboard/jobs"
                className="text-[#C2185B] text-sm font-medium hover:underline"
              >
                View all jobs
              </Link>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
                />
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Briefcase className="w-5 h-5 text-[#C2185B] mr-3" />
                            <div>
                              <div className="font-medium text-zinc-900 dark:text-white">{job.title}</div>
                              {job.compensation && <div className="text-sm text-zinc-500">{job.compensation}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === "PUBLISHED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                            {job.status === "PUBLISHED" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600">{job.locationType || "Remote"}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600">{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <Link href={`/dashboard/post-job?id=${job.id}`} className="text-zinc-600 hover:text-[#C2185B]">
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">No jobs yet</h3>
                <p className="text-zinc-500 mb-4">Post your first job to get started</p>
                <Link href="/dashboard/post-job" className="inline-flex items-center gap-2 px-4 py-2 bg-[#C2185B] text-white rounded-lg">
                  <Plus className="w-4 h-4" /> Post a Job
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center">
          <Briefcase className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">Welcome, {user?.firstName}!</h3>
          <p className="text-zinc-600">Your talent dashboard is coming soon!</p>
        </div>
      )}
    </div>
  );
}