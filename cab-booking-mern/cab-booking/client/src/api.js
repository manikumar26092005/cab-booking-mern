import axios from "axios";

const api = axios.create({
  baseURL: "https://cab-booking-mern-production.up.railway.app/api",
});

// Attach token automatically if present (user or admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
