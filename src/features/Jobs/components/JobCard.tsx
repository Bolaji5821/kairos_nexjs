import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useIsMobile } from "@/hooks/useMobile";
import { jobRoleOptions } from "@/lib/constants";
import type { IJobCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useNavigate } from "react-router";

interface JobCardProps {
  job: IJobCard;
  isActive?: boolean;
  onSelect: (jobId: string) => void;
  className?: string;
  activeTab?: string;
}

const getEmploymentType = (type?: string) => {
  if (!type) return "Not specified";

  const match = jobRoleOptions.find((option) => option.value === type);
  return match ? match.label : type;
};

export default function JobCard({
  job,
  isActive = false,
  onSelect,
  className,
  activeTab,
}: JobCardProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  const handleClick = () => {
    if (isMobile) {
      navigate(`/jobs/${job.id}`);
    } else {
      onSelect(job.id);
    }
  };

  return (
    <div
      className={cn(
        "cursor-pointer border w-full block rounded p-4 relative h-auto",
        isActive ? "bg-pink-50 border-custom-magenta-500" : "",
        job.isFeatured
          ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50"
          : "",
        className,
      )}
      onClick={handleClick}
    >
      {job?.isFeatured && (
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-amber-100 text-amber-800 border-amber-200 text-xs"
        >
          <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
          Featured
        </Badge>
      )}
      {job?.companyName && (
        <div className="flex items-center gap-2 mb-1">
          <Avatar>
            <AvatarImage src={job.profilePicture} alt={job.companyName} />
            <AvatarFallback>
              {job.companyName?.[0] ?? job?.title?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm text-gray-900">
            {job?.companyName}
          </span>
        </div>
      )}

      <h2 className="text-[17px] text-gray-900 mb-2">{job?.title}</h2>
      <div className="text-gray-700 font-semibold text-sm mb-2">
        {job?.compensation && (
          <div>
            {!isNaN(Number(job.compensation))
              ? Number(job.compensation).toLocaleString()
              : job.compensation}
          </div>
        )}
        {job?.location && <div>{job.location}</div>}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-600 text-sm">
          {getEmploymentType(job.type)}
        </span>

        {job?.status && (activeTab === "drafts" || activeTab === "own") && (
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              job?.status === "PUBLISHED"
                ? "bg-green-100 text-green-800"
                : job?.status === "CLOSED"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800",
            )}
          >
            {job?.status}
          </Badge>
        )}
      </div>
      <div className="text-gray-600 text-xs mt-4">
        {formatDate(job?.createdAt)}
      </div>
    </div>
  );
}
