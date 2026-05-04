import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { ITalentMatch } from "@/lib/types";
import { cn, removeDuplicates } from "@/lib/utils";
import { Warning2 } from "iconsax-react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface ApplicantCardProps {
  talent: ITalentMatch;
  className?: string;
}

export default function ApplicantCard({
  talent,
  className,
}: ApplicantCardProps) {
  const fullName = `${talent?.profile.firstName} ${talent?.profile.lastName}`;
  const jobTitles = talent?.profile.jobTitles;
  const skillTitles = talent?.skillSet?.map((skill) => skill.title) || [];
  const skillsToShow = removeDuplicates(skillTitles).slice(0, 3);
  const profilePicture = talent?.profile.profilePicture;
  const talentId = talent?.id;

  return (
    <Card
      className={cn(
        "flex-shrink-0 w-full rounded-2xl border border-gray-200 shadow-sm p-4 bg-white",
        className,
      )}
    >
      <CardContent className="p-0 flex h-auto flex-col gap-2 justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-12 h-12 ">
                <AvatarImage src={profilePicture || ""} alt={fullName} />
                <AvatarFallback>
                  {fullName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {talent?.isKycDone && (
                <img
                  src="/icons/verified-tick.svg"
                  alt="Verified"
                  className="absolute -bottom-0 -right-0 z-30"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1">
                <h3 className=" font-semibold">{fullName}</h3>
              </div>
              {!talent.isKycDone && (
                <div className="bg-[#FEF8EB] text-[#AF8224] text-xs px-3 py-1 rounded-full w-fit flex gap-1.5 items-center">
                  <Warning2 color="#AF8224" className="size-4" />
                  Unverified
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Available for hire</p>
          <div className="text-sm text-muted-foreground leading-snug flex-wrap flex gap-1.5">
            {jobTitles?.slice(0, 6)?.map((title, index) => (
              <span key={index}>
                {title}
                {index + 1 < jobTitles?.slice(0, 6).length && (
                  <span className="mx-1">|</span>
                )}
              </span>
            ))}
          </div>
          <div>
            <p className="text-sm italic text-gray-500 mb-1">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {skillsToShow?.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-gray-100 text-gray-700 font-medium rounded-full px-3 py-1 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Link
          to={`/jobs/talent-pool/${talentId}`}
          className="text-custom-magenta-500 mt-4 text-sm font-medium inline-flex items-center"
        >
          More Details <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
