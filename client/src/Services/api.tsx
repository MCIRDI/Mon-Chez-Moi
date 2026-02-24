import axios from "axios";

const FALLBACK_API_BASE_URL = "https://mon-chez-moi.onrender.com/api";

function normalizeBaseUrl(value: unknown): string {
  if (typeof value !== "string") {
    return FALLBACK_API_BASE_URL;
  }

  const cleanedValue = value.trim().replace(/^['"]|['"]$/g, "");
  if (!cleanedValue) {
    return FALLBACK_API_BASE_URL;
  }

  if (/^https?:\/\//i.test(cleanedValue)) {
    return cleanedValue;
  }

  if (cleanedValue.startsWith("//")) {
    return `https:${cleanedValue}`;
  }

  return `https://${cleanedValue}`;
}

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  // Render free services can take >50s to wake up from cold start.
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response || !error.config) {
      return Promise.reject(error);
    }

    const config = error.config as typeof error.config & {
      _retryWithFallback?: boolean;
    };

    if (config._retryWithFallback) {
      return Promise.reject(error);
    }

    config._retryWithFallback = true;
    config.baseURL = FALLBACK_API_BASE_URL;
    return api.request(config);
  },
);

export default api;
