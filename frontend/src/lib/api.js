import axios from "axios";

// VITE_API_URL is injected at build time by Vite from .env file.
// It should include the "/api" suffix (e.g., "https://api.hostycare.online/api" or "/api").
// In production, set VITE_API_URL to the live backend if it is on another origin.
// When frontend and backend are served together, the relative /api path works in dev and prod.
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.detail ||
      error.message ||
      "An unexpected error occurred";

    // Only attempt a token refresh once per failing request, and not on the
    // login or refresh calls themselves.
    const isAuthRequest = /\/auth\/(login|refresh)$/.test(
      originalRequest?.url || "",
    );
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_BASE}/auth/refresh`,
            refreshToken,
            { headers: { "Content-Type": "application/json" } },
          );
          const { access_token, refresh_token } = response.data;
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
          processQueue(null, access_token);
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/admin/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/admin/login";
      }
    }

    console.error(`API Error [${error.config?.url}]:`, message);
    return Promise.reject(error);
  },
);

export default api;
