"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Award, Briefcase, Star, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTalentById, PublicTalent } from "@/lib/api";

export default function TalentDetailPage() {
  const params = useParams();
  const [talent, setTalent] = useState<PublicTalent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const response = await getTalentById(params.id as string);
        setTalent(response.data || null);
      } catch (error) {
        console.error("Failed to fetch talent:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTalent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-8"></div>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3"></div>
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

  if (!talent) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-4">Talent not found</h2>
        <Link href="/talents" className="text-[#C2185B] hover:underline">
          Back to all talents
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/talents" className="inline-flex items-center text-zinc-500 hover:text-[#C2185B] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to all talents
          </Link>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
              {talent.profilePicture ? (
                <img
                  src={talent.profilePicture}
                  alt={`${talent.firstName} ${talent.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/10 rounded-full flex items-center justify-center">
                  <Award className="w-12 h-12 text-[#C2185B]" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold dark:text-white mb-2">
                  {talent.firstName} {talent.lastName}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  {talent.jobTitles.join(", ")}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {talent.location || "Remote"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    {talent.experienceLevel}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {talent.employmentType}
                  </div>
                </div>
              </div>
            </div>

            {talent.bio && (
              <div className="mb-8">
                <h2 className="text-xl font-bold dark:text-white mb-4">About</h2>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{talent.bio}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold dark:text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {talent.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-[#C2185B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#A3154D] transition-all shadow-lg shadow-pink-500/10">
                Contact Talent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
