// src/api/http.js
import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

// create instance
const http = axios.create({
  baseURL,
});

// 🔥 ALWAYS attach latest token dynamically
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // remove old header first
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

// 🔥 AUTO LOGOUT IF TOKEN INVALID
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.clear();

      // redirect to login instantly
      window.location.href = "/admin-login";
    }
    return Promise.reject(error);
  }
);

export default http;
