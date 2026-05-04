import { useMemo } from "react";
import useUser from "./useUser";
import { USER_ROLES } from "@/lib/constants";

export default function useProfileCompletion() {
  const { user } = useUser();

  const profileCompletion = useMemo(() => {
    if (!user?.data) {
      return { percentage: 0, completedFields: 0, totalFields: 0 };
    }

    const profile = user.data.profile;
    const isCompany = user.data.role === USER_ROLES.Company;

    // Define required fields for each user type
    const companyFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "phone",
      "companyName",
      "industry",
      "companySize",
      "companyWebsite",
      "bio",
      "employmentType",
      "address",
      "userLocation",
    ];

    const studentFields = [
      "firstName",
      "lastName",
      "dob",
      "gender",
      "bio",
      "address",
      "phone",
      "employmentType",
      "experienceLevel",
      "jobRole",
      "universityAttended",
      "universityEmail",
      "userLocation",
    ];

    const requiredFields = isCompany ? companyFields : studentFields;

    let completedFields = 0;

    // Check profile fields
    requiredFields.forEach((field) => {
      if (field === "userLocation") {
        // handle userLocation
        const location = profile?.userLocation;
        if (location && location.country && location.state) {
          completedFields++;
        }
      } else {
        const value = profile?.[field as keyof typeof profile];
        if (value && value !== "" && value !== null && value !== undefined) {
          // For arrays, check if they have at least one item
          if (Array.isArray(value)) {
            if (value.length > 0) completedFields++;
          } else {
            completedFields++;
          }
        }
      }
    });

    // For students, also check skillSet and jobTitles
    if (!isCompany) {
      // Check if user has skills
      if (user.data.skillSet && user.data.skillSet.length > 0) {
        completedFields++;
      }

      // Check if user has job titles
      if (
        profile?.jobTitles &&
        Array.isArray(profile.jobTitles) &&
        profile.jobTitles.length > 0
      ) {
        completedFields++;
      }
    }

    const totalFields = isCompany
      ? companyFields.length
      : studentFields.length + 2; // +2 for skills and jobTitles for students
    const percentage = Math.round((completedFields / totalFields) * 100);

    return {
      percentage,
      completedFields,
      totalFields,
    };
  }, [user]);

  return profileCompletion;
}
