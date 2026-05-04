import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import type { IJobApplicant } from "@/lib/types";
import { useShare } from "@/hooks/useShare";
import { ExportSquare } from "iconsax-react";
import { MapPinned } from "lucide-react";
import { removeDuplicates } from "@/lib/utils";

interface CandidateDetailsProps {
  selectedCandidate: IJobApplicant | null;
  jobSkills?: string[];
}

export default function CandidateDetails({
  selectedCandidate,
  jobSkills = [],
}: CandidateDetailsProps) {
  const { handleShare } = useShare({
    type: "candidate",
    data: selectedCandidate,
  });

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

  if (!selectedCandidate) {
    return (
      <Card className="bg-[#E8E4E8]/20 p-4">
        <div className="flex items-center justify-center h-64 text-gray-500">
          Select a candidate to view their details
        </div>
      </Card>
    );
  }

  const { user } = selectedCandidate;
  const fullName = `${user.profile.firstName} ${user.profile.lastName}`;
  const jobTitles =
    user.profile.jobTitles?.join(" | ") || "Job titles not specified";

  // Calculate skill matching
  const userSkills = user.skillSet || [];
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
  const additionalSkills = userSkills.filter(
    (skill) => !jobSkillsLower.includes(skill.title.toLowerCase()),
  );

  const skillMatchCount = matchedSkills.length;
  const totalJobSkills = deduplicatedJobSkills.length || 1;
  const skillMatchPercentage = Math.round(
    (skillMatchCount / totalJobSkills) * 100,
  );

  return (
    <Card className="bg-[#E8E4E8]/20 p-4">
      <div className="flex gap-3 items-start">
        <div className="flex justify-between items-start flex-1">
          <div className="relative">
            <Avatar className="w-12 h-12 ">
              <AvatarImage
                src={user.profile.profilePicture || ""}
                alt={fullName}
              />
              <AvatarFallback>
                {user.profile.firstName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {user.isKycDone && (
              <img
                src="/icons/verified-tick.svg"
                alt="Verified"
                className="absolute -bottom-0 -right-0 z-30"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold text-lg">{fullName}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          aria-label="Share candidate profile"
        >
          <ExportSquare size="32" color="black" className="w-5 h-5" />
        </Button>
      </div>

      <div>
        <p className="mt-2 text-sm font-medium">{jobTitles}</p>
        <p className="text-sm flex items-center gap-1">
          <MapPinned className="w-4 h-4" />
          &nbsp;
          {user.profile.address || "Location not specified"}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Applied: {getTimeAgo(selectedCandidate.createdAt)}
        </p>
      </div>

      <Separator className="my-3" />

      <div className="text-sm">
        <div className="flex items-center justify-between">
          <p className="italic font-semibold">
            Skill Match: {skillMatchCount}/{totalJobSkills}
          </p>
          {skillMatchPercentage >= 60 ? (
            <Badge className="ml-2 bg-pink-600 text-white">Strong Match!</Badge>
          ) : skillMatchPercentage >= 30 ? (
            <Badge className="bg-yellow-600 text-white">Good Match</Badge>
          ) : (
            <Badge className="bg-gray-500 text-white">Low Match</Badge>
          )}
        </div>

        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold text-green-700 text-xs mb-2">
              ✓ Required Skills Match
            </p>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, index) => (
                <Badge
                  key={`matched-${index}`}
                  className="bg-green-100 text-green-800 border border-green-200"
                >
                  {skill.title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold text-red-700 text-xs mb-2">
              ✗ Missing Required Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <Badge
                  key={`missing-${index}`}
                  className="bg-red-100 text-red-800 border border-red-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Additional Skills */}
        {additionalSkills.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold text-blue-700 text-xs mb-2">
              + Additional Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {additionalSkills.map((skill, index) => (
                <Badge
                  key={`additional-${index}`}
                  className="bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {skill.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800">Profile Bio</h4>
          <p className="mt-1 text-gray-700">
            {user.profile.bio || "No bio provided yet."}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">Contact Information</h4>
          <div className="mt-1 text-gray-700 space-y-1">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {user.profile.phone && (
              <p>
                <strong>Phone:</strong> {user.profile.phone}
              </p>
            )}
            {user.profile.address && (
              <p>
                <strong>Address:</strong> {user.profile.address}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
