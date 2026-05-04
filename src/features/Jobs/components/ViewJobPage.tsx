import { Link, useParams } from "react-router";
import JobDetails from "./JobDetails";
import { getUserJobById } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function ViewJobPage() {
  const { id: jobId } = useParams();

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getUserJobById(jobId!),
    enabled: !!jobId,
    retry: false,
  });

  if (jobLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-48 space-y-4">
        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
        <p className="text-gray-500 text-sm">Loading job details...</p>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/jobs"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      {job && job && <JobDetails {...job.data} />}
    </>
  );
}
