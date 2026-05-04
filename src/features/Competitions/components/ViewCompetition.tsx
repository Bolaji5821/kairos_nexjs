import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompetitionCard } from "@/features/Dashboard/components/CompetitionCard";
import useUser from "@/hooks/useUser";
import { useShare } from "@/hooks/useShare";
import { filterOpenCompetitions } from "@/lib/utils";
import {
  applyToCompetition,
  getCompetitions,
  getOwnerCompetitionById,
  getPublicCompetitionById,
  bookmarkCompetition,
  removeCompetitionFromBookmark,
  isCompetitionBookmarked,
} from "@/services/competitionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { ExportSquare, ProfileTick } from "iconsax-react";
import { Bookmark, ChevronLeft, Loader2, SquarePen } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import Timer from "./Timer";

function ViewCompetition() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const isOwn = searchParams.get("own") === "true";
  const queryClient = useQueryClient();

  const { user } = useUser();

  // Helper function to safely format dates
  const safeFormatDate = (
    dateString: string | null | undefined,
    formatStr: string = "do MMMM, yyyy",
  ) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatStr) : "Invalid date";
  };

  // Helper function to safely create date objects
  const safeCreateDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  };

  const upComingCompetitionsParams = {
    own: "general",
  };

  const { data: competitions, isLoading: competitionsLoading } = useQuery({
    queryKey: ["competitions", upComingCompetitionsParams],
    queryFn: () => getCompetitions(upComingCompetitionsParams),
  });

  // Query to check if current competition is bookmarked
  const { data: bookmarkStatus } = useQuery({
    queryKey: ["competition-bookmark-status", params.competitionId],
    queryFn: () => isCompetitionBookmarked(params.competitionId as string),
    enabled: !!params.competitionId,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Check if competition is bookmarked
  const isCompetitionCurrentlyBookmarked = bookmarkStatus?.data ?? false;

  // Use different endpoints based on whether it's the user's own competition
  const {
    data: ownCompetition,
    isLoading: ownCompetitionLoading,
    error: ownCompetitionError,
  } = useQuery({
    queryKey: ["competition-by-owner", params.competitionId],
    queryFn: () => getOwnerCompetitionById(params.competitionId as string),
    enabled: !!params.competitionId && isOwn,
    refetchOnWindowFocus: false,
  });

  const {
    data: publicCompetition,
    isLoading: publicCompetitionLoading,
    error: publicCompetitionError,
  } = useQuery({
    queryKey: ["competition-by-public", params.competitionId],
    queryFn: () => getPublicCompetitionById(params.competitionId as string),
    enabled: !!params.competitionId && !isOwn,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: applyToCompetition,
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      // Refetch the competition data to get updated isApplied status
      if (!isOwn && params.competitionId) {
        queryClient.invalidateQueries({
          queryKey: ["competition-by-public", params.competitionId],
        });
      }

      // Redirect to external submission link after successful application
      if (competition?.externalApplyLink) {
        setTimeout(() => {
          window.open(competition.externalApplyLink, "_blank");
        }, 1000); // Small delay to let the user see the success message
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleApply = () => {
    if (!params.competitionId) {
      toast.error("Competition ID not found");
      return;
    }

    // Check if application deadline has passed
    if (competition?.applicationDeadline) {
      const deadline = safeCreateDate(competition.applicationDeadline);
      const now = new Date();
      if (deadline && now > deadline) {
        toast.error("Application deadline has passed for this competition");
        return;
      }
    }

    mutate(params.competitionId);
  };

  // Determine which competition data to use
  const competition = isOwn
    ? ownCompetition?.data
    : publicCompetition?.data?.data;
  const isApplied = isOwn ? false : publicCompetition?.data?.isApplied || false;
  const competitionLoading = isOwn
    ? ownCompetitionLoading
    : publicCompetitionLoading;
  const competitionError = isOwn ? ownCompetitionError : publicCompetitionError;

  const { handleShare } = useShare({
    type: "competition",
    data: competition,
    additionalParams: isOwn ? { own: "true" } : {},
  });

  // Handle sharing the competition
  const handleShareCompetition = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleShare();
  };

  // Check if application deadline has passed
  const applicationDeadlinePassed = competition?.applicationDeadline
    ? (() => {
        const deadline = new Date(competition.applicationDeadline);
        return isValid(deadline) ? new Date() > deadline : false;
      })()
    : false;

  // Get host information - use current user for own competitions, competition.user for public
  const hostInfo =
    isOwn && user?.data
      ? {
          isKycDone: user.data.isKycDone,
          profile: user.data.profile,
          id: user.data.id,
        }
      : competition && "user" in competition && competition.user
        ? { ...competition.user, id: undefined } // Public competitions don't have user ID accessible
        : null;

  // Check if the current user is the creator of the competition
  // For own competitions (isOwn=true), we already know the user is the creator
  const isUserCreator = user?.data?.id === competition?.userId;

  // Bookmark mutations
  const {
    mutate: bookmarkCompetitionMutate,
    isPending: bookmarkingCompetition,
  } = useMutation({
    mutationFn: bookmarkCompetition,
    onSuccess: () => {
      toast.success("Competition bookmarked successfully!");
      // Invalidate bookmark status query for this competition
      queryClient.invalidateQueries({
        queryKey: ["competition-bookmark-status", params.competitionId],
      });
      // Invalidate bookmarked competitions query to refetch data
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-competitions"],
      });
      // Also invalidate competitions query to update bookmark state
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to bookmark competition");
    },
  });

  const {
    mutate: removeCompetitionFromBookmarkMutate,
    isPending: removingCompetitionFromBookmarks,
  } = useMutation({
    mutationFn: removeCompetitionFromBookmark,
    onSuccess: () => {
      toast.success("Competition removed from bookmarks successfully!");
      // Invalidate bookmark status query for this competition
      queryClient.invalidateQueries({
        queryKey: ["competition-bookmark-status", params.competitionId],
      });
      // Invalidate bookmarked competitions query to refetch data
      queryClient.invalidateQueries({
        queryKey: ["bookmarked-competitions"],
      });
      // Also invalidate competitions query to update bookmark state
      queryClient.invalidateQueries({
        queryKey: ["competitions"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Failed to remove competition from bookmarks",
      );
    },
  });

  // Handle bookmarking
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!params.competitionId) {
      toast.error("Competition ID not found");
      return;
    }

    if (isCompetitionCurrentlyBookmarked) {
      removeCompetitionFromBookmarkMutate(params.competitionId);
    } else {
      bookmarkCompetitionMutate({ competitionId: params.competitionId });
    }
  };

  return (
    <div>
      <Link
        to="/competitions"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      {competitionLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-8 h-8 text-custom-magenta-500" />
        </div>
      ) : competitionError ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 text-lg">Failed to load competition</p>
          <p className="text-sm text-gray-400 mt-2">
            {competitionError instanceof Error
              ? competitionError.message
              : "There was an error loading the competition details. Please try again later."}
          </p>
        </div>
      ) : competition ? (
        <div className="flex flex-col gap-5 mt-5">
          <div className="h-60 w-full">
            <img
              src={competition.coverImage || "/illustrations/auth.png"}
              alt={competition.title}
              className="h-full w-full object-cover rounded-2xl"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p>{safeFormatDate(competition.startsAt)}</p>
                {(isOwn || isUserCreator) && (
                  <Badge
                    variant="secondary"
                    className="bg-custom-magenta-100 text-custom-magenta-700"
                  >
                    Your Competition
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-semibold">{competition.title}</p>
              <p className="text-sm text-gray-500">
                {competition.shortDescription}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              {isOwn || isUserCreator ? (
                <Link
                  to={`/competitions/new?competitionId=${params.competitionId}`}
                >
                  <Button variant="outline" className="px-4 h-11">
                    Edit
                    <SquarePen />
                  </Button>
                </Link>
              ) : (
                <Button
                  className={`px-4 h-11 ${isApplied ? "bg-green-600 hover:bg-green-700" : ""}`}
                  onClick={handleApply}
                  disabled={isPending || applicationDeadlinePassed || isApplied}
                >
                  {isPending
                    ? "Applying..."
                    : isApplied
                      ? "Applied ✓"
                      : applicationDeadlinePassed
                        ? "Deadline Passed"
                        : "Apply"}
                </Button>
              )}
              <div onClick={(e) => e.preventDefault()} className="flex gap-2 ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-[#E8E4E8]/20"
                  onClick={handleBookmark}
                  disabled={
                    bookmarkingCompetition || removingCompetitionFromBookmarks
                  }
                  aria-label="Bookmark competition"
                >
                  <Bookmark
                    className="h-4 w-4"
                    fill={
                      isCompetitionCurrentlyBookmarked
                        ? "#2C3177"
                        : "transparent"
                    }
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-[#E8E4E8]/20"
                  onClick={handleShareCompetition}
                  aria-label="Share competition"
                >
                  <ExportSquare color="black" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="bg-[#E8E4E8]/20 p-4 shadow-none border-none col-span-2">
              {competition.description && (
                <div className="mt-2">
                  <h4 className="font-semibold text-gray-800">Description</h4>
                  <div
                    className="mt-1 text-gray-700 text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: competition.description,
                    }}
                  />
                </div>
              )}

              {competition.prize && (
                <div className="text-sm">
                  <div className="flex items-center justify-between">
                    <p className="italic font-semibold">Prize</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 text-custom-magenta-500">
                    <Badge variant="outline">{competition.prize}</Badge>
                  </div>
                </div>
              )}

              {competition.whatToSubmit && (
                <div>
                  <h4 className="font-semibold text-sm">What to Submit</h4>
                  <p className="mt-1 text-sm">
                    For this competition, you need to submit:
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline">{competition.whatToSubmit}</Badge>
                  </div>
                </div>
              )}

              {competition.externalApplyLink && (
                <p className="text-sm text-gray-600 mt-2">
                  External submission link:
                  <a
                    href={competition.externalApplyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-custom-magenta-500 hover:underline ml-1"
                  >
                    {competition.externalApplyLink}
                  </a>
                </p>
              )}
            </Card>

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-xl font-semibold">Hosted by:</h3>
                {hostInfo ? (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={hostInfo?.profile?.profilePicture ?? ""}
                        alt={`${hostInfo?.profile?.firstName} ${hostInfo?.profile?.lastName}`}
                      />
                      <AvatarFallback>
                        {hostInfo?.profile?.firstName[0]}
                        {hostInfo?.profile?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <p className="font-semibold">
                      {hostInfo?.profile?.companyName ||
                        `${hostInfo?.profile?.firstName} ${hostInfo?.profile?.lastName}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Host information not available
                  </p>
                )}
              </div>

              {competition?.prize || competition?.prizeAmount ? (
                <div className="bg-custom-magenta-50 p-4 rounded-lg space-y-1.5">
                  <h3 className="text-xl font-semibold">Reward</h3>
                  <h3 className="text-xl font-semibold">
                    🎖️ {competition.prize}
                  </h3>
                  <h3 className="text-xl font-semibold">
                    {competition.prizeAmount}
                  </h3>
                </div>
              ) : null}

              <div className="flex flex-col mt-2 gap-1.5">
                <p className="font-semibold">Submission Date & Time</p>
                <div className="flex-1">
                  <p
                    className={`text-xs ${applicationDeadlinePassed ? "text-red-500 font-medium" : ""}`}
                  >
                    {applicationDeadlinePassed
                      ? "Deadline passed on "
                      : "Closing on "}
                    {safeFormatDate(competition.applicationDeadline)}
                  </p>
                  {!applicationDeadlinePassed &&
                    competition.applicationDeadline && (
                      <Timer targetDate={competition.applicationDeadline} />
                    )}
                  {applicationDeadlinePassed && (
                    <p className="text-red-500 text-xs mt-1">
                      Applications are no longer being accepted
                    </p>
                  )}
                </div>

                {(isOwn || isUserCreator) &&
                  competition &&
                  "applications" in competition &&
                  competition.applications && (
                    <div className=" space-y-2">
                      <p className="text-sm">Applicants</p>
                      <div className="flex items-center gap-1">
                        <ProfileTick color="black" className="size-6" />
                        <p
                          className={`${
                            competition.applications.length === 0
                              ? "text-sm text-gray-500"
                              : "text-xl"
                          }`}
                        >
                          {competition.applications.length > 0
                            ? competition.applications.length
                            : "No applicants yet"}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div>
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
                </Button>
              </Link>
            </div>

            <div className="w-full overflow-hidden">
              {competitionsLoading && (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
                </div>
              )}

              {!competitionsLoading &&
                competitions?.data &&
                competitions.data.length > 0 &&
                (() => {
                  // Filter out competitions where applications have closed and exclude current competition
                  const openCompetitions = filterOpenCompetitions(
                    competitions.data,
                  );
                  // .filter((comp) => comp.id !== competition.id);

                  return openCompetitions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div className="flex gap-4 pb-4 pl-2 pr-4">
                        {openCompetitions.map((competition) => (
                          <CompetitionCard
                            key={competition.id}
                            competition={competition}
                            className="w-80"
                          />
                        ))}
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
                        No ongoing competitions
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        All competitions have closed their applications. Check
                        back later for new opportunities.
                      </p>
                    </div>
                  );
                })()}

              {!competitionsLoading &&
                (!competitions?.data || competitions.data.length === 0) && (
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
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-lg">Competition not found</p>
          <p className="text-sm text-gray-400 mt-2">
            The competition you're looking for doesn't exist or has been
            removed.
          </p>
        </div>
      )}
    </div>
  );
}

export default ViewCompetition;
