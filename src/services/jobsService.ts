import type {
  AdminJobDetailsResponse,
  AppliedJobsResponse,
  BookmarkResponse,
  JobApplicantsResponse,
  JobDetailsResponse,
  JobsListResponse,
  JobTitlesResponse,
  RecruiterJobsListResponse,
  SkillsResponse,
  TalentMatchResponse,
} from "@/lib/types";
import authedFetch from "./api";

export const getSkills = async (
  params: Record<string, any>,
): Promise<SkillsResponse> => {
  const { data } = await authedFetch.get(`/default/skills-get`, {
    params,
  });
  return data;
};

export const postJob = async (data: Record<string, any>) => {
  try {
    const res = await authedFetch.post(`/opportunity`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateJob = async (data: Record<string, any>) => {
  try {
    const res = await authedFetch.patch(`/opportunity/update`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getJobs = async (
  params: Record<string, any>,
): Promise<JobsListResponse> => {
  const { data } = await authedFetch.get(`/opportunity`, {
    params,
  });
  return data;
};

export const getAppliedJobs = async (
  params: Record<string, any>,
): Promise<AppliedJobsResponse> => {
  const { data } = await authedFetch.get(`/opportunity/user-applied`, {
    params,
  });
  return data;
};

export const getUserJobById = async (
  id: string,
): Promise<JobDetailsResponse> => {
  const { data } = await authedFetch.get(`/opportunity/user-get/${id}`);
  return data;
};

export const getAdminJobById = async (
  id: string | number,
): Promise<AdminJobDetailsResponse> => {
  const { data } = await authedFetch.get(`/opportunity/admin-get/${id}`);
  return data;
};

export const getApplicantsById = async (
  id: string,
): Promise<JobApplicantsResponse> => {
  const { data } = await authedFetch.get(`/opportunity/applicants/${id}`);
  return data;
};

export const getRecommendationsById = async (id: number) => {
  const { data } = await authedFetch.get(`/opportunity/recommendations/${id}`);
  return data;
};

export const applyToJob = async (data: { opportunityId: string }) => {
  try {
    const res = await authedFetch.post(`/opportunity/apply`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getTalentMatch = async (
  params?: Record<string, any>,
): Promise<TalentMatchResponse> => {
  const { data } = await authedFetch.get(`/users/talent-match`, { params });
  return data;
};

export const getRecruiterJobs = async (
  params: Record<string, any>,
): Promise<RecruiterJobsListResponse> => {
  const { data } = await authedFetch.get(`/opportunity`, {
    params: { ...params, own: "me" },
  });
  return data;
};

export const bookmarkJob = async (data: { opportunityId: string }) => {
  try {
    const res = await authedFetch.post(`/bookmark`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const removeJobFromBookmark = async (data: {
  opportunityId: string;
}) => {
  try {
    const res = await authedFetch.delete(`/bookmark`, { data });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getBookmarkedJobs = async (
  params: Record<string, any>,
): Promise<BookmarkResponse> => {
  const { data } = await authedFetch.get(`/bookmark`, {
    params,
  });
  return data;
};

export const getJobTitles = async (
  params: Record<string, any>,
): Promise<JobTitlesResponse> => {
  const { data } = await authedFetch.get(`/default/job-titles-get`, {
    params,
  });
  return data;
};

export const deleteJob = async (id: string) => {
  try {
    const res = await authedFetch.delete(`/opportunity/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};
