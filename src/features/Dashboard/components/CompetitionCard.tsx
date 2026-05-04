import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import Timer from "@/features/Competitions/components/Timer";
import { useShare } from "@/hooks/useShare";
import type { Competition } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  bookmarkCompetition,
  isCompetitionBookmarked,
  removeCompetitionFromBookmark,
} from "@/services/competitionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { ExportSquare } from "iconsax-react";
import { BadgeCheck, Bookmark } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CompetitionCardProps {
  competition: Competition;
  className?: string;
  isOwn?: boolean;
  isBookmarked?: boolean;
}

export function CompetitionCard({
  competition,
  className,
  isOwn = false,
  isBookmarked = false,
}: CompetitionCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleShare } = useShare({
    type: "competition",
    data: competition,
    additionalParams: isOwn ? { own: "true" } : {},
  });

  // Query to check if competition is bookmarked
  const { data: bookmarkStatus } = useQuery({
    queryKey: ["competition-bookmark-status", competition.id],
    queryFn: () => isCompetitionBookmarked(competition.id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Use the API result if available, otherwise fall back to the prop
  const isActuallyBookmarked = bookmarkStatus?.data ?? isBookmarked;

  // Bookmark mutations
  const {
    mutate: bookmarkCompetitionMutateFn,
    isPending: bookmarkingCompetition,
  } = useMutation({
    mutationFn: bookmarkCompetition,
    onSuccess: () => {
      toast.success("Competition bookmarked successfully!");
      // Invalidate bookmark status query for this competition
      queryClient.invalidateQueries({
        queryKey: ["competition-bookmark-status", competition.id],
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
    mutate: removeCompetitionFromBookmarkMutateFn,
    isPending: removingCompetitionFromBookmarks,
  } = useMutation({
    mutationFn: removeCompetitionFromBookmark,
    onSuccess: () => {
      toast.success("Competition removed from bookmarks successfully!");
      // Invalidate bookmark status query for this competition
      queryClient.invalidateQueries({
        queryKey: ["competition-bookmark-status", competition.id],
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

    if (isActuallyBookmarked) {
      removeCompetitionFromBookmarkMutateFn(competition.id);
    } else {
      bookmarkCompetitionMutateFn({ competitionId: competition.id });
    }
  };

  // Handle sharing the competition
  const handleShareCompetition = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await handleShare();
  };

  // Handle Continue Editing for draft competitions
  const handleContinueEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/competitions/new?competitionId=${competition.id}`);
  };

  // Calculate time remaining until application deadline
  const now = new Date();
  const deadline = new Date(competition.applicationDeadline);
  const timeDiff = isValid(deadline) ? deadline.getTime() - now.getTime() : -1;

  // Check if competition is new (created within last 24 hours)
  const createdAt = new Date(competition.createdAt);
  const isNew =
    isValid(createdAt) &&
    now.getTime() - createdAt.getTime() < 24 * 60 * 60 * 1000;

  return (
    <Card
      onClick={() => {
        if (competition.status === "DRAFT") return; // Don't navigate for draft competitions
        navigate(`/competitions/${competition.id}${isOwn ? "?own=true" : ""}`);
      }}
      className={cn(
        "shrink-0 group py-0 relative overflow-hidden gap-0 shadow-none border-none hover:shadow-md hover:border transition-shadow duration-300",
        competition.status === "DRAFT" ? "" : "cursor-pointer", // Remove cursor pointer for drafts
        className,
      )}
    >
      <div className="relative h-40 w-full overflow-hidden">
        {competition.coverImage ? (
          <img
            src={competition.coverImage}
            alt={competition.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-sm font-medium">No Cover Image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {isNew && (
          <div className="absolute top-0 left-0 py-1 px-2 bg-custom-magenta-500 text-white rounded-br-lg text-sm z-10">
            New
          </div>
        )}

        {competition.status !== "DRAFT" && (
          <div
            onClick={(e) => e.preventDefault()}
            className="flex gap-2 z-20 absolute opacity-70 top-2 right-2"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handleBookmark}
              disabled={
                bookmarkingCompetition || removingCompetitionFromBookmarks
              }
              aria-label={
                isActuallyBookmarked
                  ? "Remove bookmark from competition"
                  : "Bookmark competition"
              }
            >
              <Bookmark
                className="h-4 w-4"
                fill={isActuallyBookmarked ? "#2C3177" : "transparent"}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareCompetition}
              aria-label="Share competition"
            >
              <ExportSquare color="black" className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardContent
        className={cn(
          "text-black bg-white py-2 px-0 group-hover:px-2 transition-all duration-300",
        )}
      >
        <h3 className="text-xl font-semibold">{competition.title}</h3>
        {competition?.user && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src={competition.user.profile?.profilePicture}
                  alt={
                    competition.user.profile?.firstName &&
                    competition.user.profile?.lastName
                      ? `${competition.user.profile.firstName} ${competition.user.profile.lastName}`
                      : "Competition Author"
                  }
                />
                <AvatarFallback>
                  {competition.user.profile?.firstName?.[0] || "?"}
                  {competition.user.profile?.lastName?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              {competition.user.isKycDone && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <BadgeCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-sm font-medium">
                  {competition.user.profile?.companyName ||
                    (competition.user.profile?.firstName &&
                    competition.user.profile?.lastName
                      ? `${competition.user.profile.firstName} ${competition.user.profile.lastName}`
                      : "Anonymous")}
                </p>
                {competition.user.isKycDone && (
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                )}
              </div>
              {competition.user.profile?.companyName &&
                competition.user.profile?.firstName && (
                  <p className="text-xs text-gray-500">
                    by {competition.user.profile.firstName}&nbsp;
                    {competition.user.profile?.lastName}
                  </p>
                )}
            </div>
          </div>
        )}

        <div className="flex mt-2">
          <div className="flex-1">
            {competition.applicationDeadline && (
              <p className="text-xs">
                Closing on&nbsp;
                {(() => {
                  const deadline = new Date(competition.applicationDeadline);
                  return isValid(deadline)
                    ? format(deadline, "PP")
                    : "Date unavailable";
                })()}
              </p>
            )}
            {competition.status === "PUBLISHED" && (
              <>
                {timeDiff > 0 ? (
                  <Timer targetDate={competition.applicationDeadline} />
                ) : (
                  <p className="text-red-500 text-sm">Application closed</p>
                )}
              </>
            )}
          </div>
        </div>

        <Separator className="my-2" />

        {competition.status === "DRAFT" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm font-medium text-yellow-600">
                Draft Competition
              </p>
            </div>
            <p className="text-sm text-gray-600">
              This competition is in draft mode and not yet published.
            </p>
            <Button
              onClick={handleContinueEditing}
              className="w-full"
              size="sm"
            >
              Continue Editing
            </Button>
          </div>
        ) : (
          <div>
            <h3 className="text-sm capitalize font-semibold">
              🎖️ {competition.prize}
            </h3>
            <p className="text-sm text-gray-600">
              {competition.prizeAmount &&
              !isNaN(Number(competition.prizeAmount))
                ? Number(competition.prizeAmount).toLocaleString()
                : competition.prizeAmount}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <div className="size-4">
                <img
                  src="/icons/check.svg"
                  alt="check"
                  className="object-contain h-full w-full"
                />
              </div>
              <p className="text-sm">Open to verified users</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
