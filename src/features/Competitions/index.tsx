import { PaginationComponent } from "@/components/PaginationComp";
import SearchJob from "@/components/SearchJob";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import {
  getBookmarkedCompetitions,
  getCompetitions,
  getUserAppliedCompetitions,
} from "@/services/competitionService";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CompetitionCard } from "../Dashboard/components/CompetitionCard";
import { AppliedCompetitionCard } from "./components/AppliedCompetitionCard";

export default function Competitions() {
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const isCompany = user?.data.role === USER_ROLES.Company;

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [activeSubTab, setActiveSubTab] = useState("published");

  // Get search parameters
  const searchTitle = searchParams.get("title") || "";
  const searchLocation = searchParams.get("location") || "";

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset page when changing tabs
  };

  const handleSubTabChange = (value: string) => {
    setActiveSubTab(value);
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

  // Reset page when search parameters change
  useEffect(() => {
    setPage(1);
  }, [searchTitle, searchLocation]);

  const params = {
    pageNo: page,
    pageSize: 10,
    own: ["applied", "saved"].includes(activeTab)
      ? undefined
      : ["all"].includes(activeTab)
        ? "general"
        : "me",
    // Add search parameters
    ...(searchTitle && { title: searchTitle }),
    ...(searchLocation && { location: searchLocation }),
  };

  const { data: competitions, isLoading: competitionsLoading } = useQuery({
    queryKey: ["competitions", activeSubTab, params],
    queryFn: () => {
      // For status-based tabs, add status parameter
      if (["draft", "published", "archive", "closed"].includes(activeSubTab)) {
        return getCompetitions({
          ...params,
          status: activeSubTab.toUpperCase(),
        });
      }
      // For other tabs, use the existing logic
      return getCompetitions(params);
    },
    enabled:
      activeTab === "all" ||
      activeSubTab === "draft" ||
      activeSubTab === "published" ||
      activeSubTab === "archive" ||
      activeSubTab === "closed",
  });

  const { data: appliedCompetitions, isLoading: appliedCompetitionsLoading } =
    useQuery({
      queryKey: ["user-applied-competitions", params],
      queryFn: () => getUserAppliedCompetitions(params),
      enabled: activeTab === "applied",
    });

  const { data: bookmarkedData, isLoading: bookmarkedLoading } = useQuery({
    queryKey: ["bookmarked-competitions", params],
    queryFn: () => getBookmarkedCompetitions(params),
    enabled: activeTab === "saved",
  });

  return (
    <div className="container mx-auto ">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-6 items-center bg-gradient-to-r from-custom-blue-500 via-purple-900 to-custom-magenta-500 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-center xl:items-start lg:items-center gap-4 justify-between w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold text-white">
                {isCompany
                  ? "Join Competitions That Challenge You"
                  : "Join Competitions That Challenge You"}
              </h1>
              <p className="mt-1 text-gray-300">
                {isCompany
                  ? "View and manage all your competitions in one place."
                  : "Enter curated challenges designed for your skill level. Win recognition, build your portfolio, and stand out to hiring managers."}
              </p>
            </div>

            <Link to="/competitions/new">
              <Button
                size="lg"
                className="text-white h-12 font-normal text-sm w-fit"
              >
                Post Competition <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

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
              value="applied"
            >
              Applied
            </TabsTrigger>

            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value="own"
            >
              Own
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:text-custom-magenta-500"
              value="saved"
            >
              Saved
            </TabsTrigger>
          </TabsList>

          <SearchJob
            className="my-5 bg-[#EAEAF180]"
            placeholder="Search competitions by title, skills, or location"
            onSearch={handleSearch}
          />

          <TabsContent value="all" className="w-full">
            <div className="flex justify-center">
              {competitionsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              ) : competitions?.data && competitions.data.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {competitions.data.map((competition) => (
                      <CompetitionCard
                        key={competition.id}
                        competition={competition}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <PaginationComponent
                      pagination={competitions.pagination}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </div>
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
                    No upcoming competitions yet
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Post your first competition to start attracting talent.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="w-full">
            <div className="flex justify-center">
              {appliedCompetitionsLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              ) : appliedCompetitions?.data &&
                appliedCompetitions.data.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {appliedCompetitions.data.map((application) => (
                      <AppliedCompetitionCard
                        key={application.id}
                        title={application.competition.title}
                        shortDescription={
                          application.competition.shortDescription || ""
                        }
                        appliedAt={application.appliedAt}
                        startsAt={application.competition.startsAt}
                        endsAt={application.competition.endsAt}
                        competitionId={application.competitionId}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-6">
                    <PaginationComponent
                      pagination={appliedCompetitions.pagination}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </div>
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
                    No applied competitions
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Apply to competitions to see them here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="own" className="w-full">
            <Tabs
              value={activeSubTab}
              onValueChange={handleSubTabChange}
              className="items-start"
            >
              <TabsList className="mb-3">
                <TabsTrigger
                  className="data-[state=active]:text-custom-magenta-500"
                  value="draft"
                >
                  Draft
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:text-custom-magenta-500"
                  value="published"
                >
                  Published
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:text-custom-magenta-500"
                  value="archive"
                >
                  Archive
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:text-custom-magenta-500"
                  value="closed"
                >
                  Closed
                </TabsTrigger>
              </TabsList>

              <div className="flex justify-center w-full">
                {competitionsLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                  </div>
                ) : competitions?.data && competitions.data.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {competitions.data.map((competition) => (
                        <CompetitionCard
                          key={competition.id}
                          competition={competition}
                          isOwn
                        />
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <PaginationComponent
                        pagination={competitions.pagination}
                        handlePageChange={handlePageChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 w-full mx-auto mt-20">
                    <div className="h-24 w-24 mb-4">
                      <img
                        src="/illustrations/no-competitions.svg"
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <p className="text-gray-500 text-lg">
                      {activeSubTab === "draft"
                        ? "No draft competitions"
                        : activeSubTab === "published"
                          ? "No published competitions"
                          : activeSubTab === "archive"
                            ? "No archived competitions"
                            : "No closed competitions"}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      {activeSubTab === "draft"
                        ? "Create a new competition to see your drafts here."
                        : activeSubTab === "published"
                          ? "Publish your competitions to see them here."
                          : activeSubTab === "archive"
                            ? "Archived competitions will appear here."
                            : "Competitions that have ended will appear here."}
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </TabsContent>

          <TabsContent value="saved" className="w-full">
            <div className="flex justify-center">
              {bookmarkedLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              ) : bookmarkedData?.data && bookmarkedData.data.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookmarkedData.data.map((bookmark: any) => {
                      // Transform bookmarked competition to match Competition interface
                      const competitionWithUserData = {
                        ...bookmark.competition,
                        userId: bookmark.userId,
                        createdAt: bookmark.createdAt,
                        updatedAt: bookmark.createdAt,
                        user: bookmark.user, // User data not available for bookmarked competitions
                      };

                      return (
                        <CompetitionCard
                          key={bookmark.competitionId}
                          competition={competitionWithUserData}
                          isBookmarked={true}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-center mt-6">
                    <PaginationComponent
                      pagination={bookmarkedData.pagination}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="h-24 w-24 mb-4">
                    <img
                      src="/illustrations/no-competitions.svg"
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p className="text-gray-500 text-lg">No saved competitions</p>

                  <p className="text-sm text-gray-400 mt-2">
                    Bookmark competitions you're interested in to save them
                    here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
