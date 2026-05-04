import { PaginationComponent } from "@/components/PaginationComp";
import SearchJob from "@/components/SearchJob";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  employmentTypeOptions,
  experienceLevelOptions,
  jobRoleOptions,
} from "@/lib/constants";
import { getTalentMatch } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import ApplicantCard from "./ApplicantCard";

export default function TalentPool() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Get search parameters
  const searchTitle = searchParams.get("title") || "";
  const searchLocation = searchParams.get("location") || "";

  // Get filter parameters from URL
  const filterExperienceLevel = searchParams.get("experienceLevel") || "";
  const filterEmploymentType = searchParams.get("employmentType") || "";
  const filterJobRole = searchParams.get("jobRole") || "";
  const filterVerificationStatus = searchParams.get("verificationStatus") || "";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset page when changing tabs
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
    newSearchParams.delete("experienceLevel");
    newSearchParams.delete("employmentType");
    newSearchParams.delete("jobRole");
    newSearchParams.delete("verificationStatus");

    setPage(1);
    setSearchParams(newSearchParams);
  };

  const hasActiveFilters =
    filterExperienceLevel ||
    filterEmploymentType ||
    filterJobRole ||
    filterVerificationStatus;

  // Reset page when search or filter parameters change
  useEffect(() => {
    setPage(1);
  }, [
    searchTitle,
    searchLocation,
    filterExperienceLevel,
    filterEmploymentType,
    filterJobRole,
    filterVerificationStatus,
  ]);

  const params = {
    pageNo: page,
    pageSize: 10,
    // Add search parameters
    ...(searchTitle && { query: searchTitle }),
    ...(searchLocation && { query: searchTitle + " " + searchLocation }),
    // Add filter parameters
    ...(filterExperienceLevel && { experienceLevel: filterExperienceLevel }),
    ...(filterEmploymentType && { employmentType: filterEmploymentType }),
    ...(filterJobRole && { jobRole: filterJobRole }),
    ...(filterVerificationStatus && {
      verificationStatus: filterVerificationStatus === "true",
    }),
    // Add tab-specific parameters - only override if no explicit filter is set
    ...(activeTab === "verified" &&
      !filterVerificationStatus && { verificationStatus: true }),
  };

  const { data: talents, isLoading: talentsLoading } = useQuery({
    queryKey: ["talent-match", params],
    queryFn: () => getTalentMatch(params),
  });

  return (
    <div>
      <Link
        to="/jobs"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      <div className="flex flex-col gap-5 mt-5">
        <SearchJob
          className="mt-0 bg-[#EAEAF180]"
          placeholder="Search for top talent by skills, location, or experience"
          onSearch={handleSearch}
        />

        <div className="flex justify-center flex-wrap gap-4 mt-4 mb-6">
          <Select
            value={filterExperienceLevel}
            onValueChange={(value) =>
              handleFilterChange("experienceLevel", value)
            }
          >
            <SelectTrigger className="border rounded-lg w-fit">
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

          <Select
            value={filterEmploymentType}
            onValueChange={(value) =>
              handleFilterChange("employmentType", value)
            }
          >
            <SelectTrigger className="border rounded-lg w-fit">
              <SelectValue placeholder="Employment Type" />
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
            value={filterJobRole}
            onValueChange={(value) => handleFilterChange("jobRole", value)}
          >
            <SelectTrigger className="border rounded-lg w-fit">
              <SelectValue placeholder="Job Role" />
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
            value={filterVerificationStatus}
            onValueChange={(value) =>
              handleFilterChange("verificationStatus", value)
            }
          >
            <SelectTrigger className="border rounded-lg w-fit">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Verified Only</SelectItem>
              <SelectItem value="false">Unverified Only</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border rounded-lg"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {!searchTitle && !searchLocation && !hasActiveFilters && (
          <h3 className="text-lg font-semibold text-gray-900">
            Recommendations
          </h3>
        )}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="items-start"
        >
          <TabsList>
            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value="all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value="verified"
            >
              Verified
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full overflow-hidden">
          {talentsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
            </div>
          ) : talents?.data && talents.data.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
                {talents.data.map((talent) => (
                  <ApplicantCard
                    key={talent.id}
                    talent={talent}
                    className="w-full"
                  />
                ))}
              </div>

              {talents.pagination && (
                <div className="flex justify-center mt-6">
                  <PaginationComponent
                    pagination={talents.pagination}
                    handlePageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-64 text-gray-500">
              <div className="h-24 w-24 mb-4">
                <img
                  src="/illustrations/no-job-posts.svg"
                  alt="No talent"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-lg font-medium">
                {searchTitle || searchLocation || hasActiveFilters
                  ? "No talent found matching your criteria"
                  : "No talent recommendations yet"}
              </p>
              <p className="text-sm text-gray-400 mt-2 text-center">
                {searchTitle || searchLocation || hasActiveFilters
                  ? "Try adjusting your search or filter criteria"
                  : "Post your first job to start getting talent recommendations"}
              </p>
              {!searchTitle && !searchLocation && !hasActiveFilters && (
                <Link to="/jobs/new" className="mt-4">
                  <Button className="bg-custom-magenta-500 hover:bg-custom-magenta-600">
                    Post Your First Job
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
