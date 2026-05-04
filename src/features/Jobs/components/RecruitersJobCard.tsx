import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { JOB_TABS } from "@/lib/constants";
import type { IRecruiterJobCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router";

interface JobCardProps {
  job: IRecruiterJobCard;
  className?: string;
  isOtherJob?: boolean;
  setOpenToViewJob?: (open: boolean) => void;
  currentSubTab?: string;
}

export default function RecruitersJobCard({
  job,
  className,
  isOtherJob = false,
  setOpenToViewJob,
  currentSubTab,
}: JobCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-xl rounded-2xl border border-gray-200 shadow-none p-4 bg-white shrink-0 relative",
        job.isFeatured
          ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50"
          : "",
        isOtherJob && "cursor-pointer",
        className,
      )}
      onClick={() => {
        if (!isOtherJob) return;

        setOpenToViewJob?.(true);
      }}
    >
      {job.isFeatured && (
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-200 text-xs"
        >
          <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
          Featured
        </Badge>
      )}
      <CardContent className="space-y-2 p-0">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <p className="text-xs text-muted-foreground">
          Last updated: {format(job.updatedAt, "MMM dd, yyyy")}
        </p>

        <Separator className="my-2" />

        <div className="flex flex-col items-center justify-between pt-2">
          {isOtherJob && (
            <div className="space-y-2 w-full pb-2.5">
              <div className="flex items-center justify-between w-full">
                {job.companyName && (
                  <p className="text-sm font-medium text-gray-900">
                    {job.companyName}
                  </p>
                )}

                {job.locationType && (
                  <Badge variant="outline" className="text-xs">
                    {job.locationType}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-600">
                {job.compensation && (
                  <span className="font-medium text-green-600">
                    {!isNaN(Number(job.compensation))
                      ? Number(job.compensation).toLocaleString()
                      : job.compensation}
                  </span>
                )}

                {job.location && (
                  <span className="flex items-center">
                    <MapPin className="size-5" />
                    {job.location}
                  </span>
                )}
              </div>
            </div>
          )}

          {!isOtherJob && (
            <div className="flex items-center justify-between w-full">
              {job.applicants && (
                <div className="text-base font-medium">
                  {job.applicants?.length || 0} Application(s)
                </div>
              )}

              <Badge
                variant={
                  currentSubTab === JOB_TABS.published.value
                    ? "default"
                    : currentSubTab === JOB_TABS.draft.value
                      ? "secondary"
                      : "outline"
                }
                className="text-xs"
              >
                {job.status}
              </Badge>
            </div>
          )}
        </div>

        <div>
          {!isOtherJob && job.status === JOB_TABS.published.value && (
            <Link
              to={`/jobs/${job.id}/applicants`}
              className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
              aria-label="View applicants for this job"
            >
              View Applicants <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          )}

          {!isOtherJob && job.status === JOB_TABS.draft.value && (
            <Link to={`/jobs/new?jobId=${job.id}`} className="mt-7 block">
              <Button className="w-full" size="sm">
                Continue Editing
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
