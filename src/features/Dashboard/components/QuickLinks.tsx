import { Link } from "react-router";
import { cn } from "@/lib/utils";
import useUser from "@/hooks/useUser";
import { USER_ROLES } from "@/lib/constants";
import { useMemo } from "react";

interface QuickLinkItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  bgColor?: string;
  textColor?: string;
  priority: number;
}

interface QuickLinksProps {
  variant?: "student" | "company" | "auto";
  showTitle?: boolean;
  className?: string;
}

const QUICK_LINKS_CONFIG = {
  student: [
    {
      id: "view-jobs",
      title: "View Jobs",
      description: "Start applying with no long forms",
      icon: "/icons/briefcase.svg",
      link: "/jobs",
    },
    {
      id: "start-competing",
      title: "Start Competing",
      description: "Join competition, show your skills & win rewards",
      icon: "/icons/competing.svg",
      link: "/competitions",
      bgColor: "bg-custom-magenta-500",
    },
    {
      id: "looking-for-talent",
      title: "Looking for talent?",
      description: "Post a job to connect with skilled candidates.",
      icon: "/icons/talent.svg",
      link: "/jobs/new",
      bgColor: "bg-custom-blue-50",
      textColor: "text-custom-blue-500",
    },
  ] as QuickLinkItem[],
  company: [
    {
      id: "post-job",
      title: "Post a Job",
      description:
        "Create a job listing in minutes and get matched with top candidates.",
      icon: "/icons/briefcase.svg",
      link: "/jobs/new",
    },
    {
      id: "launch-competition",
      title: "Launch a Competition",
      description:
        "Engage people through real-world tasks and creative briefs.",
      icon: "/icons/competing.svg",
      link: "/competitions/new",
      bgColor: "bg-custom-magenta-500",
    },
    {
      id: "view-applicants",
      title: "View Applicants",
      description:
        "Review applications, shortlist candidates, and track match quality.",
      icon: "/icons/applicants.svg",
      link: "/jobs",
      bgColor: "bg-custom-magenta-50",
      textColor: "text-custom-blue-500",
    },
    {
      id: "explore-talent",
      title: "Explore Talent Pool",
      description:
        "Browse verified profiles and connect with candidates that fit your needs.",
      icon: "/icons/talent.svg",
      link: "/jobs/talent-pool",
      bgColor: "bg-custom-blue-50",
      textColor: "text-custom-blue-500",
    },
  ] as QuickLinkItem[],
} as const;

function QuickLinks({
  variant = "auto",
  showTitle = true,
  className,
}: QuickLinksProps) {
  const { user } = useUser();

  // Determine user type with improved logic
  const getUserType = (): "student" | "company" => {
    if (variant !== "auto") return variant;
    return user?.data?.role === USER_ROLES.Student ? "student" : "company";
  };
  const userType = getUserType();

  // Memoize the quick links computation for better performance
  const quickLinks = useMemo(() => {
    let links = QUICK_LINKS_CONFIG[userType].sort(
      (a, b) => a.priority - b.priority,
    );

    return links;
  }, [userType]);

  // Responsive grid configuration
  const gridConfig = {
    student: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    company: "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">Quick Links</h2>
        </div>
      )}

      <div className={cn("grid gap-4", gridConfig[userType])}>
        {quickLinks.map((link) => (
          <QuickLinkCard key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}

// Separate component for individual quick link cards
function QuickLinkCard({ link }: { link: QuickLinkItem }) {
  return (
    <Link
      to={link.link}
      className="group block rounded-lg"
      aria-label={`${link.title}: ${link.description}`}
    >
      <div
        className={cn(
          "relative w-full h-[270px] p-4 rounded-lg shadow-sm border border-gray-200",
          "flex flex-col justify-between",
          "bg-custom-blue-500 text-white", // default colors
          link.bgColor,
        )}
        role="article"
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <img
              src={link.icon}
              alt={link.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Content */}
        <div className={cn("space-y-3", link.textColor)}>
          <h3 className="font-semibold text-lg leading-tight">{link.title}</h3>
          <p className="text-sm leading-relaxed">{link.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default QuickLinks;
