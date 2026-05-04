import axios, { type AxiosError } from "axios";

export const authlessFetch = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

const authedFetch = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

/**
 * Creates an instance of an axios client with authentication headers
 * @param {string} baseURL - base URL for the API
 */
authedFetch.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("kairos_acccess_token");
    // Check if there is an access token
    if (token) {
      // Add the access token to the headers
      config.headers["Authorization"] = `Bearer ${token}`;
      // Return the updated config
      return config;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default authedFetch;
