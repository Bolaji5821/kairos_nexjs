import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useShare } from "@/hooks/useShare";
import { Bookmark, Share2, Star } from "lucide-react";
import { Link } from "react-router";

interface JobCardProps {
  id?: string;
  companyName: string;
  position: string;
  salary: string;
  locationType: string;
  hoursPerWeek: string;
  isFeatured?: boolean;
}

export function JobCard({
  id,
  companyName,
  position,
  salary,
  locationType,
  hoursPerWeek,
  isFeatured = false,
}: JobCardProps) {
  const { handleShare } = useShare({
    type: "job",
    data: { id, title: position, companyName },
  });

  return (
    <Card
      className={`w-full px-5 py-4 group ${isFeatured ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50" : ""}`}
    >
      <Link to={`/jobs?jobId=${id}`} className="h-full">
        <CardContent className="p-0 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                {isFeatured && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                    Featured
                  </Badge>
                )}
              </div>
              <div
                onClick={(e) => e.preventDefault()}
                className="flex gap-2 opacity-0 duration-300 transition-opacity group-hover:opacity-100"
              >
                <Button variant="outline" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleShare();
                  }}
                  aria-label="Share job"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex gap-3">
                <div>
                  <h3 className="font-normal mb-1 text-gray-500 text-sm">
                    {companyName}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {position}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-base font-medium">
                {salary && !isNaN(Number(salary))
                  ? Number(salary).toLocaleString()
                  : salary}
              </p>
              <span className="text-gray-500">|</span>
              <p className="text-gray-600">{locationType}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-500">{hoursPerWeek}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
