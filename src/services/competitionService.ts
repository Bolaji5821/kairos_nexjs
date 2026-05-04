import authedFetch from "./api";
import type {
  CompetitionResponse,
  SingleCompetitionResponse,
  OwnCompetitionResponse,
  BookmarkedCompetitionResponse,
  AppliedCompetitionResponse,
  IsBookmarkedResponse,
} from "@/lib/types";

export const postCompetition = async (data: FormData) => {
  try {
    const res = await authedFetch.post(`/competition`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateCompetition = async (data: FormData) => {
  try {
    const res = await authedFetch.patch(`/competition/update`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getCompetitions = async (
  params?: Record<string, any>,
): Promise<CompetitionResponse> => {
  const { data } = await authedFetch.get(`/competition`, { params });
  return data;
};

export const getCompetitionsPostedByMe = async (
  params: Record<string, any>,
): Promise<CompetitionResponse> => {
  const ownParams = {
    ...params,
    own: "me",
  };
  const { data } = await authedFetch.get(`/competition`, { params: ownParams });
  return data;
};

export const getOwnerCompetitionById = async (
  competitionId: string,
): Promise<OwnCompetitionResponse> => {
  const { data } = await authedFetch.get(`/competition/owner/${competitionId}`);
  return data;
};

export const getPublicCompetitionById = async (
  competitionId: string,
): Promise<SingleCompetitionResponse> => {
  const { data } = await authedFetch.get(
    `/competition/public/${competitionId}`,
  );
  return data;
};

export const applyToCompetition = async (competitionId: string) => {
  try {
    const res = await authedFetch.post(`/competition/apply/${competitionId}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const bookmarkCompetition = async (data: { competitionId: string }) => {
  try {
    const res = await authedFetch.post(`/bookmark/competition`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const removeCompetitionFromBookmark = async (competitionId: string) => {
  try {
    const res = await authedFetch.delete(
      `/bookmark/competition/${competitionId}`,
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getUserAppliedCompetitions = async (
  params: Record<string, any>,
): Promise<AppliedCompetitionResponse> => {
  const { data } = await authedFetch.get(`/competition/user-applied`, {
    params,
  });
  return data;
};

export const isCompetitionBookmarked = async (
  competitionId: string,
): Promise<IsBookmarkedResponse> => {
  try {
    const res = await authedFetch.get(
      `/bookmark/competition/isbookmarked/${competitionId}`,
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getBookmarkedCompetitions = async (
  params: Record<string, any>,
): Promise<BookmarkedCompetitionResponse> => {
  const { data } = await authedFetch.get(`/bookmark/competition`, {
    params,
  });
  return data;
};
