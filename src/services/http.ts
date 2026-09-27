import axios from "axios";

import { ROUTES } from "@/types/routes";
import router from "@/router";

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

http.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore().logout();
      router.push({ path: ROUTES.LOGIN, query: { redirect: router.currentRoute.value.fullPath } });
    }

    return Promise.reject(error);
  }
);
