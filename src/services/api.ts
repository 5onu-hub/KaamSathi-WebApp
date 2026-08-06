import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  // Add Clerk token or auth headers if available
  return config;
}, (error) => {
  return Promise.reject(error);
});
