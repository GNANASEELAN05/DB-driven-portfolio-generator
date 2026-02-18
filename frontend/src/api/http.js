// src/api/http.js
import axios from "axios";

/*
  Uses production backend on Vercel
  Falls back to localhost for local dev
*/

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://db-driven-portfolio-generator-backend.onrender.com/api";

// axios instance
const http = axios.create({
  baseURL,
});

// ================= REQUEST INTERCEPTOR =================
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
http.interceptors.response.use(
  (res) => res,
  (error) => {

    // ❗ DO NOT redirect on login/register failure
    const requestURL = error?.config?.url || "";

    const isAuthRequest =
      requestURL.includes("/api/auth/login") ||
      requestURL.includes("/api/auth/register");

    if (error?.response?.status === 401 && !isAuthRequest) {
      // only for token expired AFTER login

      localStorage.removeItem("token");
      sessionStorage.clear();

      // go to common login page
      window.location.href = "/adminpanel/login";
    }

    return Promise.reject(error);
  }
);

export default http;
