import { shareContent } from "@/lib/utils";
import { useCallback } from "react";

interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

interface UseShareProps {
  type: "job" | "competition" | "talent" | "candidate";
  data: any;
  additionalParams?: Record<string, string>;
}

export const useShare = ({
  type,
  data,
  additionalParams = {},
}: UseShareProps) => {
  const handleShare = useCallback(async () => {
    if (!data) return;

    let shareOptions: ShareOptions;
    const baseUrl = import.meta.env.VITE_LIVE_SITE_URL;
    const params = new URLSearchParams(additionalParams).toString();
    const paramString = params ? `?${params}` : "";

    switch (type) {
      case "job":
        shareOptions = {
          title: data.companyName
            ? `${data.title} at ${data.companyName}`
            : data.title,
          text: data.companyName
            ? `Check out this job opportunity: ${data.title} at ${data.companyName}`
            : `Check out this job opportunity: ${data.title}`,
          url: `${baseUrl}/jobs?jobId=${data.id}`,
        };
        break;

      case "competition":
        shareOptions = {
          title: data.title,
          text: `Check out this competition: ${data.title}`,
          url: `${baseUrl}/competitions/${data.id}${paramString}`,
        };
        break;

      case "talent":
        const talentName = data.profile
          ? `${data.profile.firstName} ${data.profile.lastName}`
          : `${data.firstName} ${data.lastName}`;
        shareOptions = {
          title: `${talentName} - Talent Profile`,
          text: `Check out this talent profile: ${talentName}`,
          url: `${baseUrl}/jobs/talent/${data.id || data.userId}`,
        };
        break;

      case "candidate":
        const candidateName = data.user?.profile
          ? `${data.user.profile.firstName} ${data.user.profile.lastName}`
          : data.profile
            ? `${data.profile.firstName} ${data.profile.lastName}`
            : `${data.firstName} ${data.lastName}`;
        shareOptions = {
          title: `${candidateName} - Candidate Profile`,
          text: `Check out this candidate profile: ${candidateName}`,
          url: `${baseUrl}/jobs/candidate/${data.id || data.userId}`,
        };
        break;

      default:
        console.error("Invalid share type provided");
        return;
    }

    try {
      await shareContent(shareOptions);
    } catch (error) {
      console.error(`Failed to share ${type}:`, error);
    }
  }, [type, data, additionalParams]);

  return { handleShare };
};
