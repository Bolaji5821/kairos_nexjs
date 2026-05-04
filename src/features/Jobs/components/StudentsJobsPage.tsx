import { ManageJobAlert } from "@/components/ManageJobAlert";
import { PaginationComponent } from "@/components/PaginationComp";
import SearchJob from "@/components/SearchJob";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import JobCard from "@/features/Jobs/components/JobCard";
import JobDetails from "@/features/Jobs/components/JobDetails";
import { useJobAlerts } from "@/hooks/useJobAlerts";
import {
  datePostedOptions,
  employmentTypeOptions,
  experienceLevelOptions,
  jobRoleOptions,
} from "@/lib/constants";
import type { IAppliedJob, IBookmarkedJob, IJobCard } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  getAppliedJobs,
  getBookmarkedJobs,
  getJobs,
  getUserJobById,
} from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function StudentsJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedJobFromUrl = searchParams.get("jobId");

  const [page, setPage] = useState(1);
  const [lastData, setLastData] = useState<any>(null);
  const [jobId, setJobId] = useState<string>();
  const [activeTab, setActiveTab] = useState("all-jobs");
  const {
    showJobAlertModal,
    setShowJobAlertModal,
    hasExistingAlert,
    searchQuery,
  } = useJobAlerts();

  // Get search parameters
  const searchTitle = searchParams.get("title") || "";
  const searchLocation = searchParams.get("location") || "";

  // Get filter parameters from URL
  const filterType = searchParams.get("type") || "";
  const filterLocationType = searchParams.get("locationType") || "";
  const filterDatePosted = searchParams.get("datePosted") || "";
  const filterExperienceLevel = searchParams.get("experienceLevel") || "";

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(searchParams);

    // Clear the jobId URL parameter when switching tabs
    if (selectedJobFromUrl) {
      newSearchParams.delete("jobId");
    }

    // Clear search parameters when switching to any tab other than "all-jobs"
    if (value !== "all-jobs") {
      newSearchParams.delete("title");
      newSearchParams.delete("location");
    }

    setSearchParams(newSearchParams);
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

    // Switch to "all-jobs" tab if currently on "saved" or "applied" and a filter is being applied
    if (
      (activeTab === "saved" || activeTab === "applied") &&
      value &&
      value !== ""
    ) {
      setActiveTab("all-jobs");
    }
  };

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Remove all filter parameters but keep search parameters
    newSearchParams.delete("type");
    newSearchParams.delete("locationType");
    newSearchParams.delete("datePosted");
    newSearchParams.delete("experienceLevel");

    // Reset page to 1
    setPage(1);

    setSearchParams(newSearchParams);
  };

  const hasActiveFilters =
    filterType ||
    filterLocationType ||
    filterDatePosted ||
    filterExperienceLevel;

  const params = {
    pageNo: page,
    pageSize: 10,
    own:
      activeTab === "drafts" || activeTab === "own"
        ? "me"
        : activeTab !== "saved" && activeTab !== "applied"
          ? "general"
          : undefined,
    // Add status for drafts
    ...(activeTab === "drafts" && { status: "DRAFT" }),
    // Add search parameters only for "all-jobs" tab
    ...(activeTab === "all-jobs" && {
      ...(searchTitle && { title: searchTitle }),
      ...(searchLocation && { location: searchLocation }),
    }),
    // Add filter parameters only for tabs that support filtering (not applied or saved)
    ...(activeTab !== "applied" &&
      activeTab !== "saved" && {
        ...(filterType && { type: filterType }),
        ...(filterLocationType && { locationType: filterLocationType }),
        ...(filterDatePosted && { datePosted: filterDatePosted }),
        ...(filterExperienceLevel && {
          experienceLevel: filterExperienceLevel,
        }),
      }),
  };

  // Regular jobs query
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", params, activeTab],
    queryFn: () => getJobs(params),
    enabled: activeTab !== "saved" && activeTab !== "applied",
  });

  // Applied jobs query
  const { data: appliedJobsData, isLoading: appliedJobsLoading } = useQuery({
    queryKey: ["applied-jobs", params],
    queryFn: () => getAppliedJobs(params),
    enabled: activeTab === "applied",
  });

  // Bookmarked jobs query
  const { data: bookmarkedData, isLoading: bookmarkedLoading } = useQuery({
    queryKey: ["bookmarked-jobs", params],
    queryFn: () => getBookmarkedJobs(params),
    enabled: activeTab === "saved",
  });

  // Determine which data to use based on active tab
  const data =
    activeTab === "saved"
      ? bookmarkedData
      : activeTab === "applied"
        ? appliedJobsData
        : jobsData; // This covers "all-jobs", "recent-jobs", and "drafts"
  const isLoading =
    activeTab === "saved"
      ? bookmarkedLoading
      : activeTab === "applied"
        ? appliedJobsLoading
        : jobsLoading;

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getUserJobById(jobId!),
    enabled: !!jobId,
    retry: false,
  });

  console.log("Job Details Data:", job);

  // Update lastData only when data changes and is not undefined
  if (data && data !== lastData) {
    setLastData(data);
  }

  // Reset page when search parameters change
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

  const displayData = isLoading && lastData ? lastData : data;
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    // First priority: job selected from URL
    if (selectedJobFromUrl) {
      setJobId(selectedJobFromUrl);
      return;
    }

    // Second priority: set default job based on current tab
    if (
      activeTab === "saved" &&
      bookmarkedData?.data &&
      bookmarkedData.data.length > 0
    ) {
      // For saved/bookmarked jobs, use opportunityId
      setJobId(bookmarkedData?.data[0].opportunityId);
    } else if (
      activeTab === "applied" &&
      appliedJobsData?.data &&
      appliedJobsData.data.length > 0
    ) {
      // For applied jobs, use opportunityId
      setJobId(appliedJobsData.data[0].opportunityId);
    } else if (
      (activeTab === "all-jobs" ||
        activeTab === "own" ||
        activeTab === "drafts") &&
      jobsData?.data &&
      jobsData.data.length > 0
    ) {
      // For regular jobs, recent jobs, and drafts, use id
      setJobId(jobsData.data[0].id);
    } else {
      // Clear jobId when there are no jobs in the current tab
      setJobId(undefined);
    }
  }, [
    selectedJobFromUrl,
    bookmarkedData,
    appliedJobsData,
    jobsData,
    activeTab,
    page,
  ]);

  const emptyState =
    (activeTab === "saved" &&
      (!bookmarkedData?.data || bookmarkedData.data.length === 0)) ||
    (activeTab === "applied" &&
      (!appliedJobsData?.data || appliedJobsData.data.length === 0)) ||
    (activeTab === "all-jobs" &&
      (!jobsData?.data || jobsData.data.length === 0)) ||
    (activeTab === "recent-jobs" &&
      (!jobsData?.data || jobsData.data.length === 0)) ||
    (activeTab === "drafts" && (!jobsData?.data || jobsData.data.length === 0));

  return (
    <>
      {/* Search Section */}
      <div className="flex justify-center">
        <SearchJob className="bg-gray-100" onSearch={handleSearch} />
      </div>
      {/* Filters */}
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
          onValueChange={(value) => handleFilterChange("locationType", value)}
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
            <SelectValue placeholder="Type" />
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

        {/* Clear Filters Button */}
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

        {/* Manage job alert */}
        <Dialog open={showJobAlertModal} onOpenChange={setShowJobAlertModal}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Create Job Alert</DialogTitle>
            </DialogHeader>
            <ManageJobAlert
              showOnlyAddForm={true}
              initialKeyword={searchQuery}
              onSuccess={() => setShowJobAlertModal(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Create Alert Button - only show if there's a search query and no existing alert */}
        {searchQuery && !hasExistingAlert && (
          <Button
            size="lg"
            className="text-white h-9 font-normal text-sm w-fit rounded-sm ml-auto"
            onClick={() => setShowJobAlertModal(true)}
          >
            Create Alert
          </Button>
        )}
      </div>

      <div
        className={cn(
          "block gap-5 w-full max-w-full overflow-hidden h-[calc(100vh-100px)]",
          emptyState ? "block" : "lg:grid grid-cols-5",
        )}
      >
        <div className="col-span-5 lg:col-span-2 w-full flex flex-col bg-white">
          <Tabs
            className="w-full h-full flex flex-col items-start"
            value={activeTab}
            onValueChange={(value) => {
              handleTabChange(value);
              setPage(1); // Reset page to 1 when tab changes
            }}
          >
            <div className="sticky top-0 bg-white z-10">
              <TabsList className="w-full">
                <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
                <TabsTrigger value="own">Own</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>

              {!emptyState && (
                <PaginationComponent
                  pagination={displayData?.pagination}
                  handlePageChange={handlePageChange}
                />
              )}
            </div>

            {/* Check if current tab has no data and show centered empty state */}
            {!isLoading && emptyState && (
              // Single centered empty state spanning the full width
              <div className="flex flex-col items-center justify-center text-gray-500 z-20 mx-auto mt-20">
                <div className="h-24 w-24 mb-4">
                  <img
                    src={"/illustrations/no-job-posts.svg"}
                    alt={
                      activeTab === "applied"
                        ? "No applications"
                        : activeTab === "saved"
                          ? "No saved jobs"
                          : "No jobs"
                    }
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-lg font-medium">
                  {activeTab === "applied"
                    ? "No applications yet"
                    : activeTab === "saved"
                      ? "No saved jobs"
                      : activeTab === "recent-jobs"
                        ? "No recent jobs"
                        : "No jobs available"}
                </p>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  {activeTab === "applied"
                    ? "Start applying to jobs to see them here"
                    : activeTab === "saved"
                      ? "Bookmark jobs you're interested in to save them here"
                      : activeTab === "recent-jobs"
                        ? "New job opportunities will appear here"
                        : "Check back later for new opportunities"}
                </p>
              </div>
            )}
            {
              <>
                <TabsContent
                  value="all-jobs"
                  className="flex-1 w-full min-w-0 mt-0"
                >
                  <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] relative">
                    {jobsLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
                      </div>
                    ) : jobsData?.data && jobsData.data.length > 0 ? (
                      jobsData.data.map((job: IJobCard) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isActive={jobId === job.id}
                          onSelect={(id) => setJobId(id)}
                          className="w-full"
                        />
                      ))
                    ) : null}
                  </div>
                </TabsContent>
                <TabsContent value="own" className="flex-1 w-full min-w-0 mt-0">
                  <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] relative">
                    {jobsLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
                      </div>
                    ) : jobsData?.data && jobsData.data.length > 0 ? (
                      jobsData.data
                        .slice(0, 6)
                        .map((job: IJobCard) => (
                          <JobCard
                            key={job.id}
                            job={job}
                            isActive={jobId === job.id}
                            onSelect={(id) => setJobId(id)}
                            activeTab={activeTab}
                          />
                        ))
                    ) : null}
                  </div>
                </TabsContent>
                <TabsContent
                  value="applied"
                  className="flex-1 w-full min-w-0 mt-0"
                >
                  <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] relative">
                    {appliedJobsLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
                      </div>
                    ) : appliedJobsData?.data &&
                      appliedJobsData.data.length > 0 ? (
                      appliedJobsData.data.map((application: IAppliedJob) => (
                        <JobCard
                          key={application.id}
                          job={{
                            id: application.opportunityId,
                            title: application.opportunity.title,
                            type: application.opportunity.type,
                            locationType: application.opportunity.locationType,
                            location: application.opportunity.location,
                            companyName: application.opportunity.companyName,
                            compensation: application.opportunity.compensation,
                            source: application.opportunity.source,
                            opportunityUrl:
                              application.opportunity.opportunityUrl,
                            createdAt: application.opportunity.createdAt,
                            updatedAt: application.opportunity.updatedAt,
                            isFeatured: false, // Applied jobs are not featured by default
                          }}
                          isActive={jobId === application.opportunity.id}
                          onSelect={(id) => setJobId(id)}
                        />
                      ))
                    ) : null}
                  </div>
                </TabsContent>

                <TabsContent
                  value="saved"
                  className="flex-1 w-full min-w-0 mt-0"
                >
                  <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] relative">
                    {bookmarkedLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
                      </div>
                    ) : bookmarkedData?.data &&
                      bookmarkedData.data.length > 0 ? (
                      bookmarkedData.data.map((job: IBookmarkedJob) => (
                        <JobCard
                          key={job.opportunityId}
                          job={{
                            id: job.opportunityId,
                            companyName: job.opportunity.companyName,
                            title: job.opportunity.title,
                            compensation: job.opportunity.compensation,
                            location: job.opportunity.location,
                            type: job.opportunity.type,
                            locationType: job.opportunity.locationType,
                            source: job.opportunity.source,
                            opportunityUrl: job.opportunity.opportunityUrl,
                            createdAt: job.createdAt,
                            updatedAt: job.createdAt, // Using createdAt as updatedAt since it's not available
                            isFeatured: false, // Bookmarked jobs are not featured by default
                          }}
                          isActive={jobId === job.opportunityId}
                          onSelect={(id) => setJobId(id)}
                        />
                      ))
                    ) : null}
                  </div>
                </TabsContent>

                <TabsContent
                  value="drafts"
                  className="flex-1 w-full min-w-0 mt-0"
                >
                  <div className="flex flex-col gap-4 overflow-y-auto h-[calc(100vh-220px)] relative">
                    {jobsLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
                      </div>
                    ) : jobsData?.data && jobsData.data.length > 0 ? (
                      jobsData.data.map((job: IJobCard) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          isActive={jobId === job.id}
                          onSelect={(id) => setJobId(id)}
                          activeTab={activeTab}
                          className="w-full"
                        />
                      ))
                    ) : null}
                  </div>
                </TabsContent>
              </>
            }
          </Tabs>
        </div>
        {/* Job Details - only show when there are jobs */}
        {!(!isLoading && emptyState) && (
          <div className="col-start-3 col-span-3 min-w-0 overflow-y-auto h-[calc(100vh-100px)] hidden lg:block">
            {jobLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
              </div>
            )}
            {job && job && <JobDetails {...job.data} />}
          </div>
        )}
      </div>
    </>
  );
}
