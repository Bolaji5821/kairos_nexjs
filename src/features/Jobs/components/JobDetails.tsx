import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { useShare } from "@/hooks/useShare";
import useUser from "@/hooks/useUser";
import type { IJobDetails } from "@/lib/types";
import { cn, getEmploymentType, removeDuplicates } from "@/lib/utils";
import {
  applyToJob,
  bookmarkJob,
  deleteJob,
  removeJobFromBookmark,
} from "@/services/jobsService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { ExportSquare } from "iconsax-react";
import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import BoostSkillMatch from "./BoostSkillMatch";
import HalfCircleSkillMatch from "./HalfCircleSkillMatch";

export default function JobDetails({
  data: job,
  isApplied,
  isBookmarked,
}: IJobDetails) {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { handleShare } = useShare({ type: "job", data: job });
  const navigate = useNavigate();

  // Check if the current user owns this job
  const isOwner = user?.data?.id === job?.userId;

  // Calculate skill match
  const jobSkills = removeDuplicates(job?.skills || []);
  const skills = jobSkills;
  const userSkillTitlesOriginal = removeDuplicates(
    user?.data?.skillSet?.map((skill) => skill.title) || [],
  );
  const userSkillTitles = userSkillTitlesOriginal.map((skill) =>
    skill.toLowerCase(),
  );

  const matchingSkills = jobSkills.filter((jobSkill) =>
    userSkillTitles.includes(jobSkill.toLowerCase()),
  );

  const totalRequiredSkills = jobSkills.length;
  const matchedSkillsCount = matchingSkills.length;

  // Application mutations
  const { mutate: applyToJobMutateFn, isPending: applyingToJob } = useMutation({
    mutationFn: applyToJob,
    onSuccess: () => {
      if (job.opportunityUrl) {
        window.open(job.opportunityUrl, "_blank");
      }
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["job", job.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["applied-jobs"],
      });
    },
  });

  // Bookmark mutations
  const { mutate: bookmarkJobMutateFn, isPending: bookmarkingJob } =
    useMutation({
      mutationFn: bookmarkJob,
      onSuccess: () => {
        toast.success("Job bookmarked successfully!");
        queryClient.invalidateQueries({
          queryKey: ["bookmarked-jobs"],
        });
        queryClient.invalidateQueries({
          queryKey: ["job", job.id],
        });
      },
    });

  const {
    mutate: removeJobFromBookmarkMutateFn,
    isPending: removingJobFromBookmarks,
  } = useMutation({
    mutationFn: removeJobFromBookmark,
    onSuccess: () => {
      toast.success("Job removed from bookmarks successfully!");
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-jobs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["job", job.id],
      });
    },
  });

  // Delete job mutation
  const { mutate: deleteJobMutateFn, isPending: deletingJob } = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      });
      queryClient.invalidateQueries({
        queryKey: ["recruiter-jobs"],
      });
      setDeleteDialogOpen(false);
      navigate("/jobs");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete job");
    },
  });

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Company info and actions - Mobile layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left side: Company info and job details */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Company avatar and name */}
            <div className="flex items-center justify-between lg:justify-start gap-4">
              <div className="">
                {job?.createdAt && (
                  <span className="text-gray-500 text-sm lg:hidden">
                    {(() => {
                      const date = new Date(job.createdAt);
                      return isValid(date) ? format(date, "dd MMM, yyyy") : "";
                    })()}
                  </span>
                )}

                {job?.companyName && (
                  <div className="flex items-center justify-between lg:justify-start gap-4">
                    <Avatar className="h-12 w-12 md:h-14 md:w-14">
                      <AvatarImage
                        src={job?.profilePicture}
                        alt={job?.companyName}
                      />
                      <AvatarFallback className="text-lg font-semibold">
                        {job?.companyName?.[0] ?? job?.title?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 w-1/2">
                        {job?.companyName}
                      </h3>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile action buttons */}
              <div className="flex gap-2 sm:gap-3 md:hidden justify-center sm:justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-accent"
                  onClick={handleShare}
                  aria-label="Share job"
                >
                  <ExportSquare color="black" className="w-5 h-5" />
                </Button>
                {/* {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-accent">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )} */}
              </div>
            </div>

            {/* Job title and details */}
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                {job?.title}
              </h2>
              <div className="text-gray-700 space-y-1 text-sm md:text-base">
                {job?.compensation && (
                  <p>
                    {!isNaN(Number(job.compensation))
                      ? Number(job.compensation).toLocaleString()
                      : job.compensation}
                  </p>
                )}
                {job?.location && <p>{job?.location}</p>}
                {job?.type && <p>{getEmploymentType(job?.type)}</p>}
              </div>
            </div>
          </div>

          {/* Right side: Actions and skill match - Desktop only */}
          <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-4">
            {/* Date and action buttons */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">
                {job?.createdAt
                  ? (() => {
                      const date = new Date(job.createdAt);
                      return isValid(date) ? format(date, "dd MMM, yyyy") : "";
                    })()
                  : ""}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="bg-accent"
                onClick={handleShare}
                aria-label="Share job"
              >
                <ExportSquare color="black" className="w-5 h-5" />
              </Button>
              {/* {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="bg-accent">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )} */}
            </div>

            {/* Skill match circle */}
            {!isOwner && totalRequiredSkills > 0 && (
              <HalfCircleSkillMatch
                current={matchedSkillsCount}
                total={totalRequiredSkills}
                open={open}
                setOpen={setOpen}
              />
            )}
          </div>
        </div>

        {/* Action buttons - Mobile and Tablet */}
        <div className="flex flex-col sm:flex-row gap-3 lg:hidden">
          <div className="flex gap-3 flex-1">
            {isOwner ? (
              <Link to={`/jobs/new?jobId=${job.id}`} className="flex-1">
                <Button className="gap-2 text-sm w-full">Edit Job</Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="outline"
                  className={cn(
                    "gap-2 px-3 text-sm text-custom-blue-500 hover:text-custom-blue-500 flex-1 sm:flex-none",
                    isBookmarked
                      ? "bg-custom-blue-50 hover:bg-custom-blue-50"
                      : "border-custom-blue-500",
                  )}
                  onClick={() => {
                    if (isBookmarked) {
                      removeJobFromBookmarkMutateFn({ opportunityId: job.id });
                      return;
                    }
                    bookmarkJobMutateFn({ opportunityId: job.id });
                  }}
                  loading={bookmarkingJob || removingJobFromBookmarks}
                  disabled={bookmarkingJob || removingJobFromBookmarks}
                >
                  <BookmarkIcon
                    className="w-4 h-4"
                    fill={isBookmarked ? "#2C3177" : ""}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>

                {isApplied ? (
                  <Button
                    variant="outline"
                    className="gap-2 text-sm text-gray-500 border-gray-300 flex-1 sm:w-32"
                    disabled
                  >
                    Applied
                  </Button>
                ) : (
                  <Button
                    className="gap-2 text-sm flex-1 sm:w-32"
                    onClick={() =>
                      applyToJobMutateFn({ opportunityId: job.id })
                    }
                    loading={applyingToJob}
                    disabled={applyingToJob}
                  >
                    Apply Now
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Desktop action buttons */}
        <div className="hidden lg:flex lg:gap-3 lg:justify-start">
          {isOwner ? (
            <Link to={`/jobs/new?jobId=${job.id}`}>
              <Button className="gap-2 w-32 text-sm">Edit Job</Button>
            </Link>
          ) : (
            <>
              <Button
                variant="outline"
                className={cn(
                  "gap-2 px-3 text-sm text-custom-blue-500 hover:text-custom-blue-500",
                  isBookmarked
                    ? "bg-custom-blue-50 hover:bg-custom-blue-50"
                    : "border-custom-blue-500",
                )}
                onClick={() => {
                  if (isBookmarked) {
                    removeJobFromBookmarkMutateFn({ opportunityId: job.id });
                    return;
                  }
                  bookmarkJobMutateFn({ opportunityId: job.id });
                }}
                loading={bookmarkingJob || removingJobFromBookmarks}
                disabled={bookmarkingJob || removingJobFromBookmarks}
              >
                <BookmarkIcon
                  className="w-5 h-5"
                  fill={isBookmarked ? "#2C3177" : ""}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>

              {isApplied ? (
                <Button
                  variant="outline"
                  className="gap-2 w-32 text-sm text-gray-500 border-gray-300"
                  disabled
                >
                  Applied
                </Button>
              ) : (
                <Button
                  className="gap-2 w-32 text-sm"
                  onClick={() => applyToJobMutateFn({ opportunityId: job.id })}
                  loading={applyingToJob}
                  disabled={applyingToJob}
                >
                  Apply Now
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Separator className="border-gray-200 my-4 md:my-6" />

      {/* Content sections */}
      <div className="space-y-6 text-sm md:text-[15px]">
        {/* Mobile skill match card */}
        {!isOwner && totalRequiredSkills > 0 && (
          <div className="lg:hidden">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-gray-700 text-sm font-medium">
                    Skill Match: {matchedSkillsCount}/{totalRequiredSkills}
                  </span>
                  <div className="text-xs text-gray-600">
                    {matchingSkills.length > 0
                      ? `Matching: ${matchingSkills.join(", ")}`
                      : "No matching skills found"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <HalfCircleSkillMatch
                    current={matchedSkillsCount}
                    total={totalRequiredSkills}
                    open={open}
                    setOpen={setOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Overview */}
        {job?.aiParsed && job?.aiOverview.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Overview
            </h3>
            <div className="text-gray-700 prose prose-sm md:prose max-w-none">
              {job?.aiOverview.map((overview, index) => (
                <p key={index} className="mb-2">
                  {overview}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Overview
            </h3>
            <div
              className="text-gray-700 prose prose-sm md:prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{
                __html: job?.description ?? "",
              }}
            />
          </div>
        )}

        {/* Job Description */}
        {job?.aiParsed && job?.aiDescription.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Job Description
            </h3>
            <ul className="list-disc list-inside text-gray-700 prose prose-sm md:prose max-w-none">
              {job.aiDescription.map((desc, index) => (
                <li key={index} className="mb-2">
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Job Requirments */}
        {job?.aiParsed && job?.aiRequirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Requirements
            </h3>
            <ul className="list-disc list-inside text-gray-700 prose prose-sm md:prose max-w-none">
              {job.aiRequirements.map((desc, index) => (
                <li key={index} className="mb-2">
                  {desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Job Details */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
            Job Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {job?.title && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs md:text-sm font-medium">
                  Position
                </span>
                <span className="text-gray-900 font-medium">{job?.title}</span>
              </div>
            )}
            {job?.location && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs md:text-sm font-medium">
                  Location
                </span>
                <span className="text-gray-900 font-medium">
                  {job?.location}
                </span>
              </div>
            )}
            {job?.type && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs md:text-sm font-medium">
                  Employment Type
                </span>
                <span className="text-gray-900 font-medium">
                  {getEmploymentType(job?.type)}
                </span>
              </div>
            )}
            {job?.industry && (
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs md:text-sm font-medium">
                  Department
                </span>
                <span className="text-gray-900 font-medium">
                  {job?.industry}
                </span>
              </div>
            )}
            {job?.compensation && (
              <div className="flex flex-col sm:col-span-2">
                <span className="text-gray-500 text-xs md:text-sm font-medium">
                  Compensation
                </span>
                <span className="text-gray-900 font-medium">
                  {!isNaN(Number(job.compensation))
                    ? Number(job.compensation).toLocaleString()
                    : job.compensation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop skill match */}
        {!isOwner && totalRequiredSkills > 0 && (
          <div className="hidden lg:block">
            <div className="border border-pink-200 bg-pink-50 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <span className="text-gray-700 font-medium">
                    Your skill match for this job is: {matchedSkillsCount}/
                    {totalRequiredSkills}
                  </span>
                  <div className="mt-2 text-sm text-gray-600">
                    {matchingSkills.length > 0
                      ? `Matching skills: ${matchingSkills.join(", ")}`
                      : "No matching skills found"}
                  </div>
                </div>
                <Button
                  onClick={() => setOpen(true)}
                  variant="link"
                  className="text-pink-600 hover:text-pink-700 p-0 h-auto"
                >
                  Boost Skill Match
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Required Skills */}
        {jobSkills.length > 0 && (
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => {
                const isMatched = userSkillTitles.includes(skill.toLowerCase());
                return (
                  <Badge
                    key={index}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs md:text-sm border font-medium",
                      {
                        "bg-green-50 border-green-200 text-green-700":
                          !isOwner && isMatched,
                        "bg-gray-50 border-gray-200 text-gray-700":
                          !isOwner && !isMatched,
                      },
                    )}
                  >
                    {skill}
                    {!isOwner && isMatched && " ✓"}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* About Company */}
        {(job?.companySize || job?.companyWebsite) && (
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              About Company
            </h3>
            <div className="space-y-2 text-gray-700">
              {job?.companySize && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 text-xs md:text-sm font-medium">
                    Company Size:
                  </span>
                  <span className="font-medium">{job?.companySize}</span>
                </div>
              )}
              {job?.companyWebsite && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 text-xs md:text-sm font-medium">
                    Website:
                  </span>
                  <a
                    href={job?.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom-blue-500 hover:text-custom-blue-600 underline font-medium break-all"
                  >
                    {job?.companyWebsite}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BoostSkillMatch
        open={open}
        setOpen={setOpen}
        jobSkills={jobSkills}
        userSkills={userSkillTitlesOriginal}
        matchedSkillsCount={matchedSkillsCount}
        totalRequiredSkills={totalRequiredSkills}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting "{job?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="w-28" disabled={deletingJob}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteJobMutateFn(job.id)}
              disabled={deletingJob}
              className="bg-red-600 w-28 hover:bg-red-700 focus:ring-red-600"
            >
              {deletingJob ? "Deleting..." : "Delete Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
