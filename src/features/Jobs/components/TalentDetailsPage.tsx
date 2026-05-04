import { getTalentMatch } from "@/services/jobsService";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "react-router";
import ApplicantCard from "./ApplicantCard";
import TalentDetails from "./TalentDetails";

export default function TalentDetailsPage() {
  const { data: talents, isLoading: talentsLoading } = useQuery({
    queryKey: ["talent-match"],
    queryFn: () => getTalentMatch(),
  });

  return (
    <div>
      <Link
        to="/jobs/talent-pool"
        className="text-custom-magenta-500 p-0 h-auto text-sm font-medium flex items-center hover:underline"
        aria-label="View applicants for this job"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
      </Link>

      <div className="flex flex-col gap-5 mt-5">
        <div>
          <TalentDetails />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium text-gray-900">
              Other Talents
            </h2>
          </div>

          <div className="w-full overflow-hidden">
            {talentsLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin w-6 h-6 text-custom-magenta-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex gap-4 pb-4 pl-2 pr-4">
                  {talents?.data && talents.data.length > 0 ? (
                    talents.data.map((talent) => (
                      <ApplicantCard
                        key={talent.id}
                        talent={talent}
                        className="w-80"
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center w-full h-32 text-gray-500">
                      No talent matches found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
