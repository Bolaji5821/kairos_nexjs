import type { UserResponse } from "@/lib/types";
import authedFetch, { authlessFetch } from "./api";

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { data } = await authlessFetch.post(`/auth/login/`, payload);
  return data;
};

export const getUser = async (): Promise<UserResponse> => {
  const { data } = await authedFetch.get(`/users/me`);
  return data;
};

export const getUserById = async (userId: string): Promise<any> => {
  try {
    const res = await authedFetch.get(`/users/user/${userId}`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getSchools = async (params: Record<string, any>): Promise<any> => {
  const { data } = await authedFetch.get(`/default/schools-get`, {
    params,
  });
  return data;
};

export const verifyOTP = async (payload: { event: string; otp: string }) => {
  const { data } = await authlessFetch.post(`/default/verify-otp/`, payload);
  return data;
};

export const register = async (data: {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  long?: number;
  lat?: number;
  role: string;
  universityAttended?: string;
  otp?: string;
  password: string;
}) => {
  try {
    const res = await authlessFetch.post(`/auth/register`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const getOTP = async (params: {
  destination: string;
  identity: string;
  len?: number;
}) => {
  try {
    const res = await authlessFetch.get(`/default/generate-otp`, {
      params,
    });
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const logout = async () => {
  try {
    const res = await authedFetch.post(`/logout`);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const updateUser = async (data: Record<string, any> | FormData) => {
  try {
    const res = await authedFetch.patch(`/users/update`, data);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const forgotPassword = async (payload: { email: string }) => {
  const { data } = await authlessFetch.post(`/auth/forgot-password/`, payload);
  return data;
};

export const resetPassword = async (payload: {
  email: string;
  password: string;
  otp: string;
}) => {
  const { data } = await authlessFetch.post(`/auth/reset-password/`, payload);
  return data;
};

export const updatePassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  const { data } = await authlessFetch.post(`/auth/update-password/`, payload);
  return data;
};

export const updateProfilePicture = async (formData: FormData) => {
  try {
    const res = await authedFetch.patch(`/users/profile-picture`, formData);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const checkifEmailExists = async (email: string) => {
  try {
    const res = await authlessFetch.get(`/auth/check-email-exist`, {
      params: { email },
    });
    return res.data.exists;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const verifyNin = async (payload: {
  nin: string;
  firstname: string;
  lastname: string;
}) => {
  try {
    const res = await authedFetch.post(`/users/verify-nin`, payload);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};

export const verifyCac = async (payload: {
  regNumber: string;
  companyName: string;
  companyEmail: string;
}) => {
  try {
    const res = await authedFetch.post(`/users/verify-cac`, payload);
    return res.data;
  } catch (error: any) {
    throw error?.response?.data || { message: error.message };
  }
};
