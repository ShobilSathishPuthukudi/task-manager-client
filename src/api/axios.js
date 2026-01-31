import axios from "axios";
import store from "../app/store.js";
import { updateToken } from "../features/auth/authSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");

        const token = response.data.accessToken;

        if (token) {
          store.dispatch(updateToken(token));

          originalRequest.headers["Authorization"] =
            `Bearer ${response.data.accessToken}`;

          api.defaults.headers.common["Authorization"] =
            `Bearer ${response.data.accessToken}`;
        }
        return api(originalRequest);
      } catch (error) {
        store.dispatch(logout());

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
