import { Card, CardContent } from "@/components/ui/Card";
import { format, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

interface AppliedCompetitionCardProps {
  title: string;
  shortDescription: string;
  appliedAt: string;
  startsAt: string;
  endsAt: string;
  competitionId: string;
  className?: string;
}

export function AppliedCompetitionCard({
  title,
  shortDescription,
  appliedAt,
  startsAt,
  endsAt,
  competitionId,
  className,
}: AppliedCompetitionCardProps) {
  const navigate = useNavigate();

  // Format the applied date
  const appliedDate = new Date(appliedAt);
  const formattedAppliedDate = isValid(appliedDate)
    ? format(appliedDate, "MMM dd, yyyy")
    : "Date unavailable";

  // Format the competition dates
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const formattedStartDate = isValid(startDate)
    ? format(startDate, "MMM dd, yyyy")
    : "Date unavailable";
  const formattedEndDate = isValid(endDate)
    ? format(endDate, "MMM dd, yyyy")
    : "Date unavailable";

  const handleClick = () => {
    navigate(`/competitions/${competitionId}`);
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "shrink-0 group py-0 relative overflow-hidden gap-0 shadow-none border hover:shadow-md transition-shadow duration-300 cursor-pointer",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-3">
            {shortDescription}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Starts: {formattedStartDate}</span>
              <span>Ends: {formattedEndDate}</span>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Applied on {formattedAppliedDate}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
