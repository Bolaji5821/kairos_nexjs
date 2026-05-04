import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { MapPinned } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import type { IJobApplicant } from "@/lib/types";
import { cn, removeDuplicates } from "@/lib/utils";

interface ApplicantCardProps {
  applicant: IJobApplicant;
  jobSkills?: string[];
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CandidateCard({
  applicant,
  jobSkills = [],
  isSelected = false,
  onSelect,
}: ApplicantCardProps) {
  // Calculate time since application
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const applicationDate = new Date(dateString);
    const diffInMs = now.getTime() - applicationDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return "Less than an hour ago";
    }
  };

  const jobTitles =
    applicant.user.profile.jobTitles?.join(" | ") || "Job titles not specified";

  const location = applicant.user.profile.address || "Location not specified";

  // Calculate skill matching
  const userSkills = applicant.user.skillSet || [];
  const userSkillTitles = removeDuplicates(
    userSkills.map((skill) => skill.title),
  );
  const deduplicatedJobSkills = removeDuplicates(jobSkills);
  const jobSkillsLower = deduplicatedJobSkills.map((skill) =>
    skill.toLowerCase(),
  );

  const matchedSkills = userSkills.filter((skill) =>
    jobSkillsLower.includes(skill.title.toLowerCase()),
  );
  const missingSkills = deduplicatedJobSkills.filter(
    (skill) =>
      !userSkillTitles
        .map((s) => s.toLowerCase())
        .includes(skill.toLowerCase()),
  );

  const skillMatchCount = matchedSkills.length;
  const totalJobSkills = deduplicatedJobSkills.length || 1; // Avoid division by zero
  const skillMatchPercentage = Math.round(
    (skillMatchCount / totalJobSkills) * 100,
  );

  return (
    <Card
      className={cn(
        "flex-shrink-0 w-full rounded border p-4 bg-white cursor-pointer transition-colors",
        isSelected
          ? "border-custom-magenta-500 bg-pink-50"
          : "border-gray-200 hover:border-gray-300",
      )}
      onClick={onSelect}
    >
      <CardContent className="p-0 flex h-auto flex-col gap-2 justify-between">
        <div className=" space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 ">
                <AvatarImage
                  src={applicant.user.profile.profilePicture ?? ""}
                />
                <AvatarFallback>
                  {applicant.user.profile.firstName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {applicant.user.isKycDone && (
                <img
                  src="/icons/verified-tick.svg"
                  alt="Verified"
                  className="absolute -bottom-0 -right-0 z-30"
                />
              )}
            </div>

            <div>
              <div className="flex flex-col items-start gap-1">
                <h3 className=" font-semibold">{`${applicant.user.profile.firstName} ${applicant.user.profile.lastName}`}</h3>
                <p className="text-sm text-muted-foreground -mt-1">
                  {applicant.user.email}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-2 text-sm font-medium">{jobTitles}</p>

          <p className="text-sm mt-1 flex items-center gap-1">
            <MapPinned size="20" color="black" />
            {location}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Applied: {getTimeAgo(applicant.createdAt)}
          </p>

          <Separator className="my-3" />

          <div className="text-sm">
            <p className="font-semibold">
              <span className="italic">Skill Match:</span>
              {skillMatchCount}/{totalJobSkills}
              {skillMatchPercentage >= 60 ? (
                <Badge className="ml-2 bg-pink-600 text-white">
                  Strong Match!
                </Badge>
              ) : skillMatchPercentage >= 30 ? (
                <Badge className="ml-2 bg-yellow-600 text-white">
                  Good Match
                </Badge>
              ) : (
                <Badge className="ml-2 bg-gray-500 text-white">Low Match</Badge>
              )}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Show matched skills first */}
              {matchedSkills.slice(0, 4).map((skill, index) => (
                <Badge
                  key={`matched-${index}`}
                  className="bg-green-100 text-green-800 text-xs font-medium border border-green-200"
                >
                  <span className="text-green-600">✓ </span>
                  {skill.title}
                </Badge>
              ))}
              {/* Show a few missing skills if there's space */}
              {missingSkills
                .slice(0, Math.max(0, 4 - matchedSkills.length))
                .map((skill, index) => (
                  <Badge
                    key={`missing-${index}`}
                    className="bg-red-100 text-red-800 text-xs font-medium border border-red-200"
                  >
                    <span className="text-red-600">✗ </span>
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
