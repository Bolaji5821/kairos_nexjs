import authedFetch from "./api";

export const subscribeToJobAlert = async (data: {
  keyword: string;
  isExact: boolean;
}) => {
  try {
    const res = await authedFetch.post(
      `/notification/subscribe-opportunity-alert`,
      data,
    );
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getJobAlerts = async () => {
  try {
    const res = await authedFetch.get(`/notification`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const deleteJobAlert = async (id: string) => {
  try {
    const res = await authedFetch.delete(`/notification/${id}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};
