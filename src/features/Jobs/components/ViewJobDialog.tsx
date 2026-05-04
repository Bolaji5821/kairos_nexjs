import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import useUser from "@/hooks/useUser";
import { removeDuplicates } from "@/lib/utils";
import { getUserJobById } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MapPin, SquarePen } from "lucide-react";
import { Link } from "react-router";

type Props = {
  jobId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ViewJobDialog({ jobId, open, setOpen }: Props) {
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryFn: () => getUserJobById(jobId),
    queryKey: ["other-job", jobId],
    enabled: !!jobId,
  });

  const job = data?.data?.data;

  // Check if the current user owns this job
  const isJobOwner = user?.data?.id === job?.userId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden">Open</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-48 space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-custom-magenta-500 border-t-transparent rounded-full"></div>
            <p className="text-gray-500 text-sm">Loading job details...</p>
          </div>
        )}

        {job && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {job?.companyName && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar>
                        <AvatarImage
                          src={job?.profilePicture}
                          alt={job?.companyName}
                        />
                        <AvatarFallback>
                          {job?.companyName?.[0] ?? job?.title?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {job?.title}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-gray-600">
                      {job?.companyName}
                    </DialogDescription>
                  </div>
                </div>
                {isJobOwner && (
                  <Link to={`/jobs/new?jobId=${jobId}`}>
                    <Button variant="outline" size="sm" className="gap-2 px-3">
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                )}
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Job Summary */}
              <div className="flex flex-wrap gap-4 text-sm">
                {job.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5" />
                    <span>{job.location}</span>
                  </div>
                )}

                {job.locationType && (
                  <Badge variant="outline">{job.locationType}</Badge>
                )}

                {job.type && <Badge variant="outline">{job.type}</Badge>}

                {job.experienceLevel && (
                  <Badge variant="outline">{job.experienceLevel}</Badge>
                )}
              </div>

              {/* Compensation */}
              {job.compensation && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Compensation</h3>
                  <p className="text-green-600 font-medium text-lg">
                    {!isNaN(Number(job.compensation))
                      ? Number(job.compensation).toLocaleString()
                      : job.compensation}
                  </p>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Skills Required
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {removeDuplicates(job.skills).map(
                      (skill: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Job Description */}
              {job.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Job Description
                  </h3>
                  <div className="prose max-w-none text-gray-700">
                    <div
                      className="mt-1 text-gray-700 prose prose-sm max-w-none whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: job.description ?? "",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Company Information
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Company: </span>
                    {job.companyName}
                  </p>
                  {job.industry && (
                    <p>
                      <span className="font-medium">Industry: </span>
                      {job.industry}
                    </p>
                  )}
                  {job.companySize && (
                    <p>
                      <span className="font-medium">Company Size: </span>
                      {job.companySize}
                    </p>
                  )}
                  {job.companyWebsite && (
                    <p>
                      <span className="font-medium">Website: </span>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {job.companyWebsite}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Application Details
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Posted: </span>
                    {format(new Date(job.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated: </span>
                    {format(new Date(job.updatedAt), "MMM dd, yyyy")}
                  </p>
                  {job.applicationCloseDate && (
                    <p>
                      <span className="font-medium">
                        Application Deadline:&nbsp;
                      </span>
                      {format(
                        new Date(job.applicationCloseDate),
                        "MMM dd, yyyy",
                      )}
                    </p>
                  )}
                  {job.yearsOfExperience && (
                    <p>
                      <span className="font-medium">
                        Years of Experience Required:
                      </span>
                      &nbsp;{job.yearsOfExperience} years
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="flex flex-col justify-center items-center h-48 space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-red-600 font-medium">
                Failed to load job details
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Please try again later
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && !job && (
          <div className="flex flex-col justify-center items-center h-48 space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                No job details available
              </p>
              <p className="text-gray-500 text-sm mt-1">
                This job may no longer exist
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
