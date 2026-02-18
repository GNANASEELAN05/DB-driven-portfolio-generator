// src/api/http.js
import axios from "axios";

/*
  🔥 IMPORTANT:
  For LOCAL running → uses http://localhost:8080/api
  For deployment → set VITE_API_URL in .env
*/

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://db-driven-portfolio-generator-backend.onrender.com/api";   // ✅ LOCAL BACKEND

// axios instance
const http = axios.create({
  baseURL,
});

// ================= REQUEST INTERCEPTOR =================
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // remove old header
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    // attach fresh token
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
    if (error?.response?.status === 401) {
      const authUser = localStorage.getItem("auth_user") || "";

      // clear session
      localStorage.removeItem("token");
      sessionStorage.clear();

      // try to keep same username login page
      const path = window.location.pathname || "/";
      const firstSeg = path.split("/").filter(Boolean)[0] || authUser;
      const u = (firstSeg || authUser || "").trim();

      if (u) {
        window.location.href = `/${u}/adminpanel/login`;
      } else {
        window.location.href = "/register";
      }
    }

    return Promise.reject(error);
  }
);

export default http;
