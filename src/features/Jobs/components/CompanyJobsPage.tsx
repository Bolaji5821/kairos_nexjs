import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import RecruitersJobCard from "./RecruitersJobCard";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Loader2 } from "lucide-react";
import ApplicantCard from "./ApplicantCard";
import SearchJob from "@/components/SearchJob";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useQuery } from "@tanstack/react-query";
import {
  getJobs,
  getRecruiterJobs,
  getTalentMatch,
} from "@/services/jobsService";
import type { IRecruiterJobCard } from "@/lib/types";
import { useState, useEffect } from "react";
import { PaginationComponent } from "@/components/PaginationComp";
import {
  datePostedOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  JOB_TABS,
  jobRoleOptions,
} from "@/lib/constants";
import ViewJobDialog from "./ViewJobDialog";
import { useSearchParams } from "react-router";

type Props = {};

function CompanyJobsPage({}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(JOB_TABS.jobsByMe.value);
  const [activeSubTab, setActiveSubTab] = useState(JOB_TABS.all.value);

  const [viewJob, setOpenToViewJob] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const [page, setPage] = useState(1);

  // Get search parameters
  const searchTitle = searchParams.get("title") || "";
  const searchLocation = searchParams.get("location") || "";

  // Get filter parameters from URL
  const filterType = searchParams.get("type") || "";
  const filterLocationType = searchParams.get("locationType") || "";
  const filterDatePosted = searchParams.get("datePosted") || "";
  const filterExperienceLevel = searchParams.get("experienceLevel") || "";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (title: string, location: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Update search parameters
    if (title.trim()) {
      newSearchParams.set("title", title.trim());
    } else {
      newSearchParams.delete("title");
    }

    if (location.trim()) {
      newSearchParams.set("location", location.trim());
    } else {
      newSearchParams.delete("location");
    }

    // Reset page to 1 when searching
    setPage(1);

    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value && value !== "") {
      newSearchParams.set(filterType, value);
    } else {
      newSearchParams.delete(filterType);
    }

    // Reset page to 1 when filtering
    setPage(1);

    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Keep search parameters but remove filters
    newSearchParams.delete("type");
    newSearchParams.delete("locationType");
    newSearchParams.delete("datePosted");
    newSearchParams.delete("experienceLevel");

    setPage(1);
    setSearchParams(newSearchParams);
  };

  const hasActiveFilters =
    filterType ||
    filterLocationType ||
    filterDatePosted ||
    filterExperienceLevel;

  // Reset page when search or filter parameters change
  useEffect(() => {
    setPage(1);
  }, [
    searchTitle,
    searchLocation,
    filterType,
    filterLocationType,
    filterDatePosted,
    filterExperienceLevel,
  ]);

  const ownJobsParams = {
    pageNo: page,
    pageSize: 10,
    own: "me",
    status: activeSubTab === JOB_TABS.all.value ? undefined : activeSubTab,
    // Add search and filter parameters
    ...(searchTitle && { title: searchTitle }),
    ...(searchLocation && { location: searchLocation }),
    ...(filterType && { type: filterType }),
    ...(filterLocationType && { locationType: filterLocationType }),
    ...(filterDatePosted && { datePosted: filterDatePosted }),
    ...(filterExperienceLevel && { experienceLevel: filterExperienceLevel }),
  };

  const otherJobsParams = {
    pageNo: page,
    pageSize: 10,
    own: "general",
    // Add search and filter parameters
    ...(searchTitle && { title: searchTitle }),
    ...(searchLocation && { location: searchLocation }),
    ...(filterType && { type: filterType }),
    ...(filterLocationType && { locationType: filterLocationType }),
    ...(filterDatePosted && { datePosted: filterDatePosted }),
    ...(filterExperienceLevel && { experienceLevel: filterExperienceLevel }),
  };

  // Recruiter's own jobs query
  const {
    data: ownJobs,
    isLoading: ownJobsLoading,
    error: ownJobsError,
  } = useQuery({
    queryKey: ["recruiter-jobs", ownJobsParams],
    queryFn: () => getRecruiterJobs(ownJobsParams),
    enabled: activeTab === JOB_TABS.jobsByMe.value,
  });

  const {
    data: otherJobs,
    isLoading: otherJobsLoading,
    error: otherJobsError,
  } = useQuery({
    queryKey: ["jobs", otherJobsParams],
    queryFn: () => getJobs(otherJobsParams),
    enabled: activeTab === JOB_TABS.otherJobs.value,
  });

  const {
    data: talents,
    isLoading: talentsLoading,
    error: talentsError,
  } = useQuery({
    queryKey: ["talent-match"],
    queryFn: () => getTalentMatch(),
  });

  return (
    <div className="w-full mt-8 space-y-6">
      <Tabs
        onValueChange={setActiveTab}
        defaultValue={activeTab}
        className="items-start"
      >
        <div className="w-full flex flex-col gap-5 lg:flex-row justify-between items-center">
          <TabsList>
            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value={JOB_TABS.jobsByMe.value}
            >
              {JOB_TABS.jobsByMe.name}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value={JOB_TABS.otherJobs.value}
            >
              {JOB_TABS.otherJobs.name}
            </TabsTrigger>
          </TabsList>

          <Link to="/jobs/talent-pool">
            <div className=" bg-custom-blue-50 rounded-lg px-3.5 py-1.5 text-sm font-medium text-custom-blue-500 flex items-center gap-1">
              Explore talent pool
              <ChevronRight className="h-3 w-3 text-custom-blue-500" />
            </div>
          </Link>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <SearchJob
            className="mt-0 bg-[#EAEAF180]"
            placeholder="Search by name, role, or skill (e.g., “Frontend Developer”, “Figma”)"
            onSearch={handleSearch}
          />

          <div className="flex justify-center items-center flex-wrap gap-4 mt-4 mb-6">
            <Select
              value={filterDatePosted}
              onValueChange={(value) => handleFilterChange("datePosted", value)}
            >
              <SelectTrigger className=" border rounded-lg w-fit">
                <SelectValue
                  placeholder="Date Posted"
                  className=" text-[#344054]"
                />
              </SelectTrigger>
              <SelectContent>
                {datePostedOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterLocationType}
              onValueChange={(value) =>
                handleFilterChange("locationType", value)
              }
            >
              <SelectTrigger className=" border rounded-lg w-fit">
                <SelectValue placeholder="Location Type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterType}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className=" border rounded-lg w-fit">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {jobRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterExperienceLevel}
              onValueChange={(value) =>
                handleFilterChange("experienceLevel", value)
              }
            >
              <SelectTrigger className=" border rounded-lg w-fit">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="px-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <TabsContent className="w-full" value={JOB_TABS.jobsByMe.value}>
          <Tabs
            value={activeSubTab}
            onValueChange={setActiveSubTab}
            className="items-start mb-7"
          >
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:text-custom-magenta-500"
                value={JOB_TABS.all.value}
              >
                {JOB_TABS.all.name}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:text-custom-magenta-500"
                value={JOB_TABS.published.value}
              >
                {JOB_TABS.published.name}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:text-custom-magenta-500"
                value={JOB_TABS.draft.value}
              >
                {JOB_TABS.draft.name}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:text-custom-magenta-500"
                value={JOB_TABS.archive.value}
              >
                {JOB_TABS.archive.name}
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:text-custom-magenta-500"
                value={JOB_TABS.closed.value}
              >
                {JOB_TABS.closed.name}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {ownJobs?.data && ownJobs.data.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-64 text-gray-500">
              <div className="h-24 w-24 mb-4">
                <img
                  src="/illustrations/no-job-posts.svg"
                  alt="No jobs"
                  className="h-full w-full object-contain"
                />
              </div>
              {activeSubTab === JOB_TABS.all.value && (
                <>
                  <p className="text-lg font-medium">No jobs posted yet</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    Create your first job posting to start attracting talent
                  </p>
                  <Link to="/jobs/new" className="mt-4">
                    <Button className="bg-custom-magenta-500 hover:bg-custom-magenta-600">
                      Post Your First Job
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </>
              )}
              {activeSubTab === JOB_TABS.published.value && (
                <>
                  <p className="text-lg font-medium">No published jobs</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    You don't have any published jobs yet. Published jobs are
                    visible to candidates.
                  </p>
                </>
              )}
              {activeSubTab === JOB_TABS.draft.value && (
                <>
                  <p className="text-lg font-medium">No draft jobs</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    You don't have any draft jobs. Draft jobs are saved but not
                    yet published.
                  </p>
                </>
              )}
              {activeSubTab === JOB_TABS.archive.value && (
                <>
                  <p className="text-lg font-medium">No archived jobs</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    You don't have any archived jobs. Archived jobs are hidden
                    from candidates.
                  </p>
                </>
              )}
              {activeSubTab === JOB_TABS.closed.value && (
                <>
                  <p className="text-lg font-medium">No closed jobs</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    You don't have any closed jobs. Closed jobs are no longer
                    accepting applications.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {ownJobsLoading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
              </div>
            ) : ownJobsError ? (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium text-red-500">
                  Failed to load jobs
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  There was an error loading your job posts. Please try again
                  later.
                </p>
              </div>
            ) : ownJobs?.data && ownJobs.data.length > 0 ? (
              ownJobs.data.map((job) => (
                <RecruitersJobCard
                  key={job.id}
                  job={job as IRecruiterJobCard}
                  currentSubTab={activeSubTab}
                />
              ))
            ) : null}
          </div>

          {/* Pagination outside of grid */}
          {ownJobs?.data && ownJobs.data.length > 0 && ownJobs?.pagination && (
            <div className="flex justify-center mt-6">
              <PaginationComponent
                pagination={ownJobs.pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent className="w-full" value={JOB_TABS.otherJobs.value}>
          {otherJobs?.data && otherJobs.data.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full h-64 text-gray-500">
              <div className="h-24 w-24 mb-4">
                <img
                  src="/illustrations/no-job-posts.svg"
                  alt="No jobs"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-lg font-medium">No other jobs available</p>
              <p className="text-sm text-gray-400 mt-2 text-center">
                There are currently no other job postings from other companies
                to view.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {otherJobsLoading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
              </div>
            ) : otherJobsError ? (
              <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium text-red-500">
                  Failed to load jobs
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  There was an error loading your job posts. Please try again
                  later.
                </p>
              </div>
            ) : otherJobs?.data && otherJobs.data.length > 0 ? (
              otherJobs.data.map((job) => (
                <RecruitersJobCard
                  key={job.id}
                  job={job as IRecruiterJobCard}
                  isOtherJob={activeTab === JOB_TABS.otherJobs.value}
                  setOpenToViewJob={(open) => {
                    if (open) {
                      setSelectedJobId(job.id);
                    }
                    setOpenToViewJob(open);
                  }}
                />
              ))
            ) : null}
          </div>

          {/* Pagination outside of grid */}
          {otherJobs?.data &&
            otherJobs.data.length > 0 &&
            otherJobs?.pagination && (
              <div className="flex justify-center mt-6">
                <PaginationComponent
                  pagination={otherJobs.pagination}
                  handlePageChange={handlePageChange}
                />
              </div>
            )}
        </TabsContent>
      </Tabs>

      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-900">
            Talent Match Preview
          </h2>
          <Link to="/jobs/talent-pool">
            <Button variant="link" className="text-custom-magenta-500 text-sm">
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="w-full overflow-hidden">
          {talentsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
            </div>
          ) : talentsError ? (
            <div className="flex flex-col items-center justify-center w-full h-32 text-gray-500">
              <p className="text-sm font-medium text-red-500">
                Failed to load talent matches
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please try again later
              </p>
            </div>
          ) : talents?.data && talents.data.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4 pl-2 pr-4">
                {talents.data.map((talent) => (
                  <ApplicantCard
                    key={talent.id}
                    talent={talent}
                    className="w-80"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-48 text-gray-500">
              <div className="h-16 w-16 mb-4">
                <img
                  src="/icons/talent.svg"
                  alt="No talent matches"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-lg font-medium">No talent matches found</p>
              <p className="text-sm text-gray-400 mt-2 text-center">
                Post more jobs to discover talented candidates that match your
                requirements
              </p>
            </div>
          )}
        </div>
      </div>

      <ViewJobDialog
        jobId={selectedJobId}
        open={viewJob}
        setOpen={setOpenToViewJob}
      />
    </div>
  );
}

export default CompanyJobsPage;
