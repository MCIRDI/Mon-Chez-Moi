import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
export default api;
