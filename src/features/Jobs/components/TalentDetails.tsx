import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useShare } from "@/hooks/useShare";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { removeDuplicates } from "@/lib/utils";
import { getUserById } from "@/services/authService";
import { getRecruiterJobs, getUserJobById } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { DocumentText1, ExportSquare, Image } from "iconsax-react";
import { Loader2, MapPinned, Phone, User } from "lucide-react";
import { useParams } from "react-router";
import SkillMatchCard from "./SkillsMatchCard";

export default function TalentDetails() {
  const { userId } = useParams();
  const { user } = useUser();

  const { data: talentData, isLoading } = useQuery({
    queryKey: ["talent", userId],
    queryFn: () => getUserById(userId as string),
  });

  // Get the company's most recent job for skill matching (only if current user is a company)
  const isCompany = user?.data?.role === USER_ROLES.Company;
  const { data: companyJobs } = useQuery({
    queryKey: ["recruiter-jobs", { pageNo: 1, pageSize: 1 }],
    queryFn: () => getRecruiterJobs({ pageNo: 1, pageSize: 1 }),
    enabled: isCompany,
  });

  // Get detailed job information for the most recent job
  const mostRecentJobId = companyJobs?.data?.[0]?.id;
  const { data: jobDetails, isLoading: jobDetailsLoading } = useQuery({
    queryKey: ["job-details", mostRecentJobId],
    queryFn: () => getUserJobById(mostRecentJobId as string),
    enabled: isCompany && !!mostRecentJobId,
  });

  const talent = talentData?.data;

  const { handleShare } = useShare({
    type: "talent",
    data: talent ? { ...talent, userId } : null,
  });

  // Calculate skill match with the most recent job
  const calculateSkillMatch = () => {
    if (!talent?.skillSet || !isCompany || !jobDetails?.data?.data) {
      return {
        percentage: 0,
        role: "No recent job available",
        matchingSkills: 0,
        totalSkills: 0,
      };
    }

    const mostRecentJob = jobDetails.data.data;
    const jobSkills = removeDuplicates(mostRecentJob.skills || []);
    const talentSkills = removeDuplicates(
      talent.skillSet.map((skill: { title: string }) => skill.title),
    ).map((skill) => skill.toLowerCase());

    const matchingSkills = jobSkills.filter((jobSkill: string) =>
      talentSkills.includes(jobSkill.toLowerCase()),
    );

    const percentage =
      jobSkills.length > 0
        ? Math.round((matchingSkills.length / jobSkills.length) * 100)
        : 0;

    return {
      percentage,
      role: mostRecentJob.title || "Recent Job",
      matchingSkills: matchingSkills.length,
      totalSkills: jobSkills.length,
    };
  };

  const skillMatch = calculateSkillMatch();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Talent not found</p>
      </div>
    );
  }

  return (
    <div className="block space-y-5 xl:space-y-0 xl:grid grid-cols-5 gap-4">
      <Card className="bg-[#E8E4E8]/20 p-4 shadow-none border-none col-span-3">
        <div className="flex gap-3 items-start">
          <div className="flex justify-between items-start flex-1 gap-2.5">
            <div className="relative">
              <Avatar className="w-12 h-12 ">
                <AvatarImage
                  src={talent.profile.profilePicture || ""}
                  alt={`${talent.profile.firstName} ${talent.profile.lastName}`}
                />
                <AvatarFallback>
                  {talent.profile.firstName[0]}
                  {talent.profile.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {talent.isKycDone && (
                <img
                  src="/icons/verified-tick.svg"
                  alt="Verified"
                  className="absolute -bottom-0 -right-0 z-30"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-lg">
                  {talent.profile.firstName} {talent.profile.lastName}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{talent.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label="Share talent profile"
          >
            <ExportSquare size="32" color="black" className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          <p className="mt-2 text-sm font-medium">
            {talent.profile.jobTitles.length > 0
              ? talent.profile.jobTitles.join(" | ")
              : "No job titles specified"}
          </p>
          <p className="text-sm flex items-center gap-1">
            <MapPinned className="w-4 h-4" />
            {talent.profile.address || "Location not specified"}
          </p>

          {talent.profile.phone && (
            <p className="text-sm flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {talent.profile.phone}
            </p>
          )}

          {talent.profile.gender && (
            <p className="text-sm capitalize flex items-center gap-1">
              <User className="w-4 h-4" />
              {talent.profile.gender}
            </p>
          )}

          {/* <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-custom-blue-500 h-12 px-5"
            >
              <Bookmark className="size-4" />
              Save
            </Button>

            <Button className="px-5 h-12">Invite to Apply</Button>
          </div> */}
        </div>

        <Separator className="my-3" />

        <div>
          <h4 className="font-semibold text-gray-800">Bio</h4>
          <p className="mt-1 text-gray-700 text-sm">
            {talent.profile.bio || "No bio provided"}
          </p>
        </div>

        <div className="text-sm">
          <div className="flex items-center justify-between">
            <p className="italic font-semibold">Skills</p>
            {isCompany && skillMatch.totalSkills > 0 && (
              <p className="text-xs text-muted-foreground">
                {skillMatch.matchingSkills}/{skillMatch.totalSkills} match your
                recent job
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-2 text-custom-magenta-500">
            {talent.skillSet.length > 0 ? (
              talent.skillSet.map((skill: { id: string; title: string }) => {
                const isMatched =
                  isCompany &&
                  jobDetails?.data?.data?.skills?.some(
                    (jobSkill: string) =>
                      jobSkill.toLowerCase() === skill.title.toLowerCase(),
                  );

                return (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className={
                      isMatched
                        ? "bg-green-50 border-green-200 text-green-700"
                        : ""
                    }
                  >
                    {skill.title}
                    {isMatched && " ✓"}
                  </Badge>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No skills listed</p>
            )}
          </div>
        </div>

        <div className="mt-6 text-sm space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">
              Resume and Certifications
            </h4>

            <div className="space-y-2">
              {talent.profile.resume && (
                <div className="flex items-center justify-between mt-2 bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-custom-magenta-50 p-2.5 rounded-full w-fit">
                      <DocumentText1
                        color="#de028e"
                        className="text-custom-magenta-500 size-4"
                      />
                    </div>

                    <div>
                      <p>
                        {talent.profile.firstName} {talent.profile.lastName} -
                        Resume.pdf
                      </p>
                      <p className="text-gray-500">Resume</p>
                    </div>
                  </div>

                  <a
                    href={talent.profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
                  >
                    View
                  </a>
                </div>
              )}

              {talent.profile.certificate && (
                <div className="flex items-center justify-between mt-2 bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-custom-magenta-50 p-2.5 rounded-full w-fit">
                      <Image
                        color="#de028e"
                        className="text-custom-magenta-500 size-4"
                      />
                    </div>

                    <div>
                      <p>
                        {talent.profile.firstName} {talent.profile.lastName} -
                        Certificate
                      </p>
                      <p className="text-gray-500">Certificate</p>
                    </div>
                  </div>

                  <a
                    href={talent.profile.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
                  >
                    View
                  </a>
                </div>
              )}

              {!talent.profile.resume && !talent.profile.certificate && (
                <p className="text-gray-500 text-sm mt-2">
                  No documents uploaded
                </p>
              )}
            </div>
          </div>

          {/* Additional Certifications */}
          {talent.profile.certifications &&
            talent.profile.certifications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Additional Certifications
                </h4>
                <div className="space-y-2">
                  {talent.profile.certifications.map(
                    (certification: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mt-2 bg-white p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-custom-magenta-50 p-2.5 rounded-full w-fit">
                            <DocumentText1
                              color="#de028e"
                              className="text-custom-magenta-500 size-4"
                            />
                          </div>

                          <div>
                            <p>
                              {talent.profile.firstName}{" "}
                              {talent.profile.lastName} - Certification{" "}
                              {index + 1}
                            </p>
                          </div>
                        </div>

                        <a
                          href={certification}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
        </div>
      </Card>

      <div className="space-y-6 col-start-4 col-span-2">
        {isCompany && jobDetailsLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
            <span className="ml-2 text-sm text-muted-foreground">
              Calculating skill match...
            </span>
          </div>
        ) : (
          <div>
            <SkillMatchCard
              percentage={skillMatch.percentage}
              role={skillMatch.role}
            />
            {isCompany && skillMatch.totalSkills > 0 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Based on your most recent job posting
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p>University Attended:</p>
            <p className="font-semibold text-xl">
              {talent.profile.universityAttended || "Not specified"}
            </p>
            {talent.profile.universityEmail && (
              <p className="text-sm">{talent.profile.universityEmail}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="italic font-semibold">Employment Preferences:</p>
            <div className="space-y-2">
              {talent.profile.employmentType && (
                <div>
                  <p className="text-sm font-medium">Work Type:</p>
                  <Badge variant="outline">
                    {talent.profile.employmentType}
                  </Badge>
                </div>
              )}
              {talent.profile.jobRole && (
                <div>
                  <p className="text-sm font-medium">Job Type:</p>
                  <Badge variant="outline">{talent.profile.jobRole}</Badge>
                </div>
              )}
              {talent.profile.experienceLevel && (
                <div>
                  <p className="text-sm font-medium">Experience Level:</p>
                  <Badge variant="outline">
                    {talent.profile.experienceLevel}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {talent.profile.interests.length > 0 && (
            <div className="space-y-1.5">
              <p className="italic font-semibold">Interests:</p>
              <div className="flex flex-wrap gap-2 mt-2 text-custom-magenta-500">
                {talent.profile.interests.map(
                  (interest: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {interest}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
