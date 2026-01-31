import axios from "axios";
import { use } from "react";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (req) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.accessToken) {
      req.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    return req;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL} || "http://localhost:5000/api"}/auth/refresh`,
          { withCredentials: true },
        );

        const newAccessToken = res.data?.data?.newAccessToken;
        const user = JSON.parse(localStorage.getItem("user"));

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            accessToken: newAccessToken,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
