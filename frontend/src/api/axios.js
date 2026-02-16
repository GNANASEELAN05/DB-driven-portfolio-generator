import axios from "axios";

const API = axios.create({
  baseURL: "https://portfolio-backend-cok2.onrender.com/api",
});

// attach JWT automatically (token optional)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
