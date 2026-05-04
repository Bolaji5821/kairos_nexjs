import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useShare } from "@/hooks/useShare";
import useUser from "@/hooks/useUser";
import type { IJobApplicant, IRecruiterJobCard } from "@/lib/types";
import {
  getApplicantsById,
  getRecruiterJobs,
  getUserJobById,
} from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ExportSquare } from "iconsax-react";
import { ChevronLeft, ChevronRight, Loader2, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import CandidateCard from "./CandidateCard";
import CandidateDetails from "./CandidateDetails";
import RecruitersJobCard from "./RecruitersJobCard";

export default function JobApplicants() {
  const { id: jobId } = useParams();
  const [selectedCandidate, setSelectedCandidate] =
    useState<IJobApplicant | null>(null);
  const { user } = useUser();

  const params = {
    pageNo: 1,
    pageSize: 10,
  };

  // Recruiter's own jobs query
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["recruiter-jobs", params],
    queryFn: () => getRecruiterJobs(params),
  });

  // Get job details to access skills
  const { data: jobDetails, isLoading: jobDetailsLoading } = useQuery({
    queryKey: ["job-details", jobId],
    queryFn: () => getUserJobById(jobId as string),
    enabled: !!jobId,
  });

  const { data: applicants, isLoading: applicantsLoading } = useQuery({
    queryKey: ["job-applicants", params, jobId],
    queryFn: () => getApplicantsById(jobId?.toString() ?? ""),
    enabled: !!jobId,
  });

  // Auto-select the first candidate when applicants load
  useEffect(() => {
    if (
      applicants?.data &&
      applicants.data.data.length > 0 &&
      !selectedCandidate
    ) {
      setSelectedCandidate(applicants.data.data[0]);
    }
  }, [applicants, selectedCandidate]);

  const { handleShare } = useShare({
    type: "job",
    data: applicants?.data?.opportunityDetails
      ? { ...applicants.data.opportunityDetails, id: jobId }
      : null,
  });

  // Check if the current user owns this job
  const isJobOwner = user?.data?.id === jobDetails?.data?.data?.userId;

  return (
    <div>
      <Link
        to="/jobs"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      <div className="mt-5">
        <Card>
          <CardHeader className=" flex justify-between gap-4 items-start lg:flex-row flex-col">
            <div>
              <CardTitle className=" text-2xl">
                {jobDetails?.data?.data?.title ||
                  applicants?.data.opportunityDetails?.title}
              </CardTitle>
              <p>{applicants?.data?.data.length} Applications</p>
              <CardDescription className=" text-xs">
                <div
                  className="mt-1 text-gray-700 text-sm line-clamp-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      (jobDetails?.data?.data?.description ||
                        applicants?.data.opportunityDetails?.description) ??
                      "",
                  }}
                />
              </CardDescription>
            </div>
            <div className=" flex gap-3 items-center shrink-0">
              <p className="shrink-0">
                Posted&nbsp;
                {applicants?.data.opportunityDetails?.createdAt
                  ? format(
                      new Date(applicants?.data.opportunityDetails?.createdAt),
                      "PP",
                    )
                  : "Not specified"}
              </p>

              <div className=" flex gap-3.5 items-center">
                {isJobOwner && (
                  <Link to={`/jobs/new?jobId=${jobId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 px-3 h-8"
                    >
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-accent h-7 w-7 rounded-md"
                  onClick={handleShare}
                  aria-label="Share job"
                >
                  <ExportSquare color="black" className="h-4 w-4" />
                </Button>
                {/* <div className="bg-accent h-7 w-7 rounded-md grid place-content-center">
                  <EllipsisVertical className="h-4 w-4" />
                </div> */}
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent>
            {applicantsLoading || jobDetailsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
              </div>
            ) : !applicants?.data || applicants.data.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg">
                  No applicants found for this job.
                </p>
              </div>
            ) : (
              <div className="flex gap-6 w-full max-w-full overflow-hidden h-[calc(100vh-200px)]">
                <div className="w-2/5 min-w-0 flex flex-col bg-white">
                  {/* <PaginationComponent
                    pagination={displayData?.pagination}
                    handlePageChange={handlePageChange}
                  /> */}

                  <div className="flex flex-col gap-4 overflow-y-auto flex-1">
                    {applicants.data.data.map((applicant) => (
                      <CandidateCard
                        key={applicant.id}
                        applicant={applicant}
                        jobSkills={jobDetails?.data?.data?.skills || []}
                        isSelected={selectedCandidate?.id === applicant.id}
                        onSelect={() => setSelectedCandidate(applicant)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-0 overflow-y-auto">
                  <CandidateDetails
                    selectedCandidate={selectedCandidate}
                    jobSkills={jobDetails?.data?.data?.skills || []}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-900">
            Other Active Jobs
          </h2>
          <Link to="/jobs">
            <Button variant="link" className="text-custom-magenta-500 text-sm">
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="w-full overflow-hidden">
          {jobsLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4 pl-2 pr-4">
              {jobs?.data &&
                jobs.data.map((job) => (
                  <RecruitersJobCard
                    key={job.id}
                    job={job as IRecruiterJobCard}
                    className="w-72"
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
