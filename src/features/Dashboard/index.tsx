import SearchJob from "@/components/SearchJob";
import { Button } from "@/components/ui/Button";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import type { IJobCard, IRecruiterJobCard } from "@/lib/types";
import { filterOpenCompetitions } from "@/lib/utils";
import { getCompetitions } from "@/services/competitionService";
import {
  getJobs,
  getRecruiterJobs,
  getTalentMatch,
} from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ApplicantCard from "../Jobs/components/ApplicantCard";
import RecruitersJobCard from "../Jobs/components/RecruitersJobCard";
import ProfileSetup from "../ProfileSetup";
import { CompetitionCard } from "./components/CompetitionCard";
import { JobCard } from "./components/JobCard";

import QuickLinks from "./components/QuickLinks";
import { PaginationComponent } from "@/components/PaginationComp";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const { percentage } = useProfileCompletion();

  const params = {
    pageNo: page,
    pageSize: 10,
  };

  const competitionParams = {
    own: "general",
  };

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", params],
    queryFn: () => getJobs(params),
  });

  // Recruiter's own jobs query
  const { data: recruiterJobs, isLoading: recruiterJobsLoading } = useQuery({
    queryKey: ["recruiter-jobs", params],
    queryFn: () => getRecruiterJobs(params),
  });

  const { data: talents, isLoading: talentsLoading } = useQuery({
    queryKey: ["talent-match"],
    queryFn: () => getTalentMatch(),
  });

  const { data: competitions, isLoading: competitionsLoading } = useQuery({
    queryKey: ["competitions", competitionParams],
    queryFn: () => getCompetitions(competitionParams),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const profileSetupSkipped = localStorage.getItem("profileSetupSkipped");

    if (!profileSetupSkipped || profileSetupSkipped === "false") {
      setOpen(true);
    }
  }, []);

  const isCompany = user?.data.role == USER_ROLES.Company;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl ">
        <div className="flex flex-col gap-6 items-center bg-gradient-to-r from-custom-blue-500 via-purple-900 to-custom-magenta-500 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold text-white">
                Hi, {user?.data.profile.firstName}
              </h1>
              <p className="mt-1 text-gray-300">
                {isCompany
                  ? "Welcome back! Manage your job posts and find the best talent."
                  : "Welcome back! Discover new opportunities and manage your career journey."}
              </p>
            </div>

            {percentage < 100 && (
              <Link to="/settings" className="mx-auto xl:mx-0">
                <Button
                  size="lg"
                  className="text-white h-12 w-[219px] font-normal text-sm"
                >
                  {percentage}% | Account setup&nbsp;
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
          <div className=" flex gap-3 w-full">
            <SearchJob
              placeholder={
                isCompany
                  ? "Search by name, role, or skill (e.g., “Frontend Developer”, “Figma”)"
                  : "Search for your perfect job"
              }
            />

            {/* <div className="mt-3 h-[64px] lg:h-[74px] flex justify-center items-center gap-2 max-w-4xl rounded-3xl bg-white p-4">
              <div className="h-8 w-8">
                <img
                  src="/icons/filter.svg"
                  alt="Filter icon"
                  className="object-contain h-full w-full"
                />
              </div>
              <p className=" text-[#344054] hidden md:block">Filter</p>
            </div> */}
          </div>
        </div>
        {/* Recruiter Quick Links - Top Position */}
        {isCompany && (
          <>
            <div className="w-full mt-8">
              <QuickLinks variant="company" />
            </div>

            <div className="w-full pt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-900">
                  Your active job posts
                </h2>
                <Link to="/jobs">
                  <Button
                    variant="link"
                    className="text-custom-magenta-500 text-sm"
                  >
                    View all
                  </Button>
                </Link>
              </div>
              {recruiterJobsLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              ) : recruiterJobs?.data && recruiterJobs.data.length > 0 ? (
                <div className="w-full">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {recruiterJobs.data.map((job) => (
                      <RecruitersJobCard
                        key={job.id}
                        job={job as IRecruiterJobCard}
                      />
                    ))}
                  </div>
                  {recruiterJobs?.data &&
                    recruiterJobs.data.length > 0 &&
                    recruiterJobs?.pagination && (
                      <div className="flex justify-center mt-6">
                        <PaginationComponent
                          pagination={recruiterJobs.pagination}
                          handlePageChange={handlePageChange}
                        />
                      </div>
                    )}
                </div>
              ) : (
                <div className="mt-1 gap-3 flex flex-col">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-24 w-24">
                      <img
                        src="/illustrations/no-job-posts.svg"
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <p className="text-center">No job posts yet</p>

                    <p className="text-sm text-center w-[60%] mx-auto">
                      Post your first job to start attracting talent. Track
                      applicants and match quality&nbsp;
                      <Link to={"/jobs"}>here</Link>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cold-2 xl:grid-cols-3 mt-12 gap-0 md:gap-5">
          <div className="space-y-4 col-span-2">
            {/* Student Quick Links - Lower Position */}
            {!isCompany && <QuickLinks variant="student" />}

            {isCompany ? (
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-900">
                    Talent Match Preview
                  </h2>
                  <Link to="/jobs">
                    <Button
                      variant="link"
                      className="text-custom-magenta-500 text-sm"
                    >
                      View all
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="w-full overflow-hidden">
                  {talentsLoading ? (
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {talents?.data && talents.data.length > 0 ? (
                        talents.data.map((talent) => (
                          <ApplicantCard
                            key={talent.id}
                            talent={talent}
                            className="w-full"
                          />
                        ))
                      ) : (
                        <div className="flex items-center justify-center w-full h-32 text-gray-500">
                          No talent matches found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900">
                    Featured Jobs
                  </h2>
                  <Link to="/jobs">
                    <Button
                      variant="link"
                      className="text-custom-magenta-500 text-sm"
                    >
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {
                  <>
                    {jobsLoading && (
                      <div className="flex justify-center items-center">
                        <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                      </div>
                    )}
                    <div className="mt-1 grid gap-5 sm:grid-cols-2">
                      {jobsData?.data &&
                      jobsData.data.filter((job: IJobCard) => job.isFeatured)
                        .length > 0
                        ? jobsData.data
                            .filter((job: IJobCard) => job.isFeatured)
                            .slice(0, 2)
                            .map((job: IJobCard) => (
                              <JobCard
                                key={job.id}
                                id={job.id}
                                companyName={job.companyName}
                                position={job.title}
                                salary={job.compensation || "Not specified"}
                                locationType={job.locationType}
                                hoursPerWeek="Full-time" // You can map this from job.type if needed
                                isFeatured={job.isFeatured}
                              />
                            ))
                        : !jobsLoading && (
                            <div className="col-span-2 flex flex-col items-center justify-center py-8 text-gray-500">
                              <div className="h-16 w-16 mb-4 opacity-50">
                                <img
                                  src="/icons/briefcase.svg"
                                  alt=""
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <p className="text-lg font-medium">
                                No featured jobs available
                              </p>
                              <p className="text-sm text-center mt-1">
                                Check back later for featured opportunities or
                                explore all jobs.
                              </p>
                            </div>
                          )}
                    </div>
                  </>
                }
              </div>
            )}
          </div>

          <div className="w-full xl:max-w-[323px] mt-12 md:mt-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">
                Upcoming Competitions
              </h2>

              <Link to="/competitions">
                <Button
                  variant="link"
                  className="text-custom-magenta-500 text-sm"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-1 gap-3 flex flex-col">
              {competitionsLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              ) : competitions?.data && competitions.data.length > 0 ? (
                (() => {
                  // Filter out competitions where applications have closed
                  const openCompetitions = filterOpenCompetitions(
                    competitions.data,
                  );

                  return openCompetitions.length > 0 ? (
                    openCompetitions
                      .slice(0, 2)
                      .map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          className="w-full"
                        />
                      ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="h-24 w-24 mb-4">
                        <img
                          src="/illustrations/no-competitions.svg"
                          alt=""
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <p className="text-gray-500 text-lg">
                        No ongoing competitions
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        All competitions have closed their applications. Check
                        back later for new opportunities.
                      </p>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="h-24 w-24 mb-4">
                    <img
                      src="/illustrations/no-competitions.svg"
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p className="text-gray-500 text-lg">
                    No ongoing competitions
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Post your first job to start attracting talent. Track
                    applicants and match quality here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProfileSetup open={open} setOpen={setOpen} />
    </div>
  );
}
