import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginAdmin = async (email, password) => {
  const { data } = await API.post("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });
  return data;
};

export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

export const requestPasswordChangeCode = async () => {
  const { data } = await API.post("/auth/change-password/request");
  return data;
};

export const confirmPasswordChange = async (payload) => {
  const { data } = await API.post("/auth/change-password/confirm", payload);
  return data;
};

export const loginStudent = async (admissionNumber, password) => {
  const { data } = await API.post("/auth/student-login", {
    admissionNumber,
    password,
  });
  return data;
};

export default API;