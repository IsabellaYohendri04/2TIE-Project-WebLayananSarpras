import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const getMe = () => api.get("/auth/me").then((res) => res.data);

export default api;
