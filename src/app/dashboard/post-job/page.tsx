"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Briefcase, Building, MapPin, DollarSign, FileText, Users, Calendar, Clock } from "lucide-react";
import { postJob, getJobById, updateJob, type JobRequest } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function PostJobPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("id");
  const isEditing = !!jobId;
  
  const [formData, setFormData] = useState<JobRequest>({
    title: "",
    description: "",
    type: "FULL_TIME",
    locationType: "REMOTE",
    experienceLevel: "MID",
    companyName: "",
    compensation: "",
    skills: [],
    status: "DRAFT",
  });
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEditing);

  // Fetch job data if editing
  useEffect(() => {
    if (!jobId) return;
    
    async function fetchJob() {
      try {
        const result = await getJobById(jobId as string);
        if (result.data) {
          const job = result.data;
          setFormData({
            id: job.id,
            title: job.title || "",
            description: job.description || "",
            type: job.type || "FULL_TIME",
            locationType: job.locationType || "REMOTE",
            experienceLevel: job.experienceLevel || "MID",
            companyName: job.companyName || "",
            compensation: job.compensation || "",
            skills: job.skills || [],
            status: job.status || "DRAFT",
          });
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch job details");
      } finally {
        setLoadingJob(false);
      }
    }
    
    fetchJob();
  }, [jobId]);

  const submitJob = async (payload: JobRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditing && jobId) {
        // Update existing job
        const result = await updateJob({ ...payload, id: jobId });
        if (result.data) {
          setSuccess(true);
        }
      } else {
        // Create new job
        const result = await postJob(payload);
        if (result.data) {
          setSuccess(true);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'post'} job`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitJob({ ...formData, status: formData.status || "DRAFT" });
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    const payload = { ...formData, status: "PUBLISHED" as const };
    setFormData(payload);
    submitJob(payload);
  };

  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    const payload = { ...formData, status: "DRAFT" as const };
    setFormData(payload);
    submitJob(payload);
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillsInput.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillsInput.trim()],
      });
      setSkillsInput("");
      e.preventDefault();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(skill => skill !== skillToRemove) || [],
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          {isEditing ? "Edit Job" : "Post a New Job"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {isEditing ? "Update job posting details" : "Create a job posting to attract the best talent"}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300">
          Job {isEditing ? 'updated' : 'posted'} successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Job Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={formData.companyName || ""}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
                placeholder="Your Company"
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Job Description *
          </label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>

          {/* Location Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Location Type
            </label>
            <select
              value={formData.locationType}
              onChange={(e) => setFormData({ ...formData, locationType: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
            >
              <option value="REMOTE">Remote</option>
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
            >
              <option value="JUNIOR">Junior</option>
              <option value="MID">Mid-Level</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>
        </div>

        {/* Compensation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Compensation
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={formData.compensation || ""}
              onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
              placeholder="e.g. $3,000 - $5,000 monthly"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Skills
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyDown={handleSkillsKeyDown}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C2185B]/50"
            placeholder="Type a skill and press Enter"
          />
          {formData.skills && formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-zinc-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

         {/* Actions */}
         <div className="flex gap-4 pt-4">
           <button
             type="button"
             disabled={loading}
              className={cn(
                "flex-1 py-3 rounded-xl font-medium transition-colors",
                formData.status === "PUBLISHED"
                  ? "bg-[#C2185B] text-white hover:bg-[#A3154D]"
                  : "bg-[#C2185B]/80 text-white hover:bg-[#C2185B]"
              )}
             onClick={handlePublish}
           >
             {loading ? "Posting..." : "Publish Job"}
           </button>
           <button
             type="button"
             disabled={loading}
             className="flex-1 py-3 rounded-xl font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
             onClick={handleSaveDraft}
           >
             Save as Draft
           </button>
         </div>
      </form>
    </div>
  );
}