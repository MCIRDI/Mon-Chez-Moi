import axios from "axios";



const baseURL = import.meta.env.VITE_API_BASE_URL || "https://mon-chez-moi.onrender.com/api";



const api = axios.create({

  baseURL,

  timeout: 50000,

  headers: {

    "Content-Type": "application/json",

    "Accept": "application/json",

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

export default api;

