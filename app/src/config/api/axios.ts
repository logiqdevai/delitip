import axios from "axios";
import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";
import { getAuthStoreState } from "@/stores/auth.store";

const axiosInstance = axios.create({
  baseURL: environments.apiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = getAuthStoreState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const isPublicGuestPath = (path: string) =>
  path === Routes.home ||
  path === Routes.contact ||
  path.startsWith("/legal/") ||
  /\/[^/]+\/q\/[^/]+/.test(path);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      getAuthStoreState().clearSession();
      const path = window.location.pathname;
      if (
        !isPublicGuestPath(path) &&
        path !== Routes.auth.sign_in &&
        path !== Routes.auth.sign_up &&
        path !== Routes.auth.forgot_password &&
        path !== Routes.auth.reset_password
      ) {
        window.location.href = Routes.auth.sign_in;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
