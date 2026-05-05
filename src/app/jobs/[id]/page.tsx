"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getPublicJobBySlug, PublicJob } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const slugOrId = (params.slug as string) || (params.id as string);
        if (!slugOrId) return;
        const response = await getPublicJobBySlug(slugOrId);
        setJob(response.data || null);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug || params.id) {
      fetchJob();
    }
  }, [params.slug, params.id]);

  const handleApply = () => {
    window.open('https://app.kairosng.com/auth/login', '_blank');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-8"></div>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-2xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Job not found</h2>
        <Link href="/jobs" className="text-[#C2185B] hover:underline">
          Back to all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center text-zinc-500 hover:text-[#C2185B] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all jobs
          </Link>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
              <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building className="w-8 h-8 text-[#C2185B]" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold dark:text-white mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    {job.companyName}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.locationType}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                  {job.compensation && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      {job.compensation}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleApply}
                className="bg-[#C2185B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/10"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
