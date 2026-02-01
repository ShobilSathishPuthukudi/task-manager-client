import axios from "axios";
import { updateToken, logout } from "../features/auth/authSlice.js";
import { resetState } from "../features/auth/authSlice.js";
import { clearTask } from "../features/task/taskSlice.js";
import { setToken, getToken, removeToken } from "../utils/handleToken.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes("/auth/refresh")) {
        removeToken();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshResponse = await api.get("/auth/refresh", {
          withCredentials: true,
        });
        const { newAccessToken } = refreshResponse.data;

        setToken(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (error) {
        // store.dispatch(resetState());
        // store.dispatch(clearTask());
        removeToken();
        if (window.location.pathname !== "/auth/login") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
