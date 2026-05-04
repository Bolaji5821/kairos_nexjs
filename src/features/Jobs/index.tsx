import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { Link } from "react-router";
import CompanyJobsPage from "./components/CompanyJobsPage";
import StudentsJobsPage from "./components/StudentsJobsPage";

// mockJobs.ts

export default function JobsPage() {
  const { user } = useUser();

  const isCompany = user?.data.role === USER_ROLES.Company;

  return (
    <div className="container mx-auto ">
      <div className="mx-auto max-w-7xl ">
        <div className="flex flex-col gap-6 items-center bg-gradient-to-r from-custom-blue-500 via-purple-900 to-custom-magenta-500 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 justify-between w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl font-semibold text-white ">
                {isCompany
                  ? "Manage your job postings and find the best talent."
                  : "Explore Jobs that Match You"}
              </h1>
              <p className="mt-1 text-gray-300">
                {isCompany
                  ? "View and manage all your job postings in one place."
                  : "Search, filter, and apply to jobs that fit your career path."}
              </p>
            </div>
            <Link to="/jobs/new">
              <Button
                size="lg"
                className="text-white h-12 font-normal text-sm w-fit"
              >
                Post a job <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {isCompany && <CompanyJobsPage />}

        {!isCompany && <StudentsJobsPage />}
      </div>
    </div>
  );
}
