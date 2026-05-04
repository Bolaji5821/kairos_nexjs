import { useQuery } from "@tanstack/react-query";
import { getJobAlerts } from "@/services/notificationsService";
import { useSearchParams } from "react-router";
import { useState } from "react";

export const useJobAlerts = () => {
  const [showJobAlertModal, setShowJobAlertModal] = useState(false);
  const [searchParams] = useSearchParams();

  // Fetch job alerts
  const { data: jobAlerts } = useQuery({
    queryKey: ["job-alerts"],
    queryFn: getJobAlerts,
  });

  // Check if current search has an existing alert
  const hasExistingAlert = () => {
    const title = searchParams.get("title");
    const location = searchParams.get("location");
    const searchQuery = title 
      ? (location ? `${title}, ${location}` : title)
      : "";
    
    if (!searchQuery || !jobAlerts?.data) return false;

    return jobAlerts.data.some((alert: any) =>
      alert.isExact
        ? alert.keyword.toLowerCase() === searchQuery.toLowerCase()
        : searchQuery.toLowerCase().includes(alert.keyword.toLowerCase()),
    );
  };

  return {
    showJobAlertModal,
    setShowJobAlertModal,
    hasExistingAlert: hasExistingAlert(),
    searchQuery: searchParams.get("title") 
      ? (searchParams.get("location") 
          ? `${searchParams.get("title")}, ${searchParams.get("location")}`
          : searchParams.get("title"))
      : "",
  };
};