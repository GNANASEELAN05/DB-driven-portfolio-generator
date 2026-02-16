// src/api/portfolio.js
import http from "./http";

/* =========================================================
   🔐 FORCE ADMIN TOKEN FOR ALL ADMIN CALLS
========================================================= */
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* =========================
   VIEWER (PUBLIC GETs)
========================= */
export const getProfile = () => http.get("/api/portfolio/profile");
export const getSkills = () => http.get("/api/portfolio/skills");
export const getFeaturedProjects = () => http.get("/api/projects/featured");
export const getExperience = () => http.get("/api/portfolio/experience");
export const getEducation = () => http.get("/api/portfolio/education");
export const getSocials = () => http.get("/api/portfolio/socials");
export const getAchievements = () => http.get("/api/portfolio/achievements");
export const getLanguageExperience = () => http.get("/api/portfolio/languages");

/* =========================
   ADMIN (Portfolio PUTs)
========================= */
export const updateProfile = (payload) =>
  http.put("/api/portfolio/profile", payload, authHeader());

export const updateSkills = (payload) =>
  http.put("/api/portfolio/skills", payload, authHeader());

export const updateSocials = (payload) =>
  http.put("/api/portfolio/socials", payload, authHeader());

export const saveAchievements = (payload) =>
  http.put("/api/portfolio/achievements", payload, authHeader());

export const saveLanguageExperience = (payload) =>
  http.put("/api/portfolio/languages", payload, authHeader());

export const updateEducation = (payload) =>
  http.put("/api/portfolio/education", payload, authHeader());

export const updateExperience = (payload) =>
  http.put("/api/portfolio/experience", payload, authHeader());

/* =========================
   ADMIN (Projects)
========================= */
export const getAllProjectsAdmin = () =>
  http.get("/api/projects", authHeader());

export const createProject = (payload) =>
  http.post("/api/projects", payload, authHeader());

export const updateProject = (id, payload) =>
  http.put(`/api/projects/${id}`, payload, authHeader());

export const deleteProject = (id) =>
  http.delete(`/api/projects/${id}`, authHeader());

/* =========================
   RESUME SECTION
========================= */

// upload resume (IMPORTANT FIX)
export const uploadResume = (file) => {
  const form = new FormData();
  form.append("file", file);

  return http.post("/api/resume/upload", form, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// viewer download
export const downloadResumeUrl = () =>
  `${http.defaults.baseURL}/api/resume/download`;

export const viewResumeUrl = () =>
  `${http.defaults.baseURL}/api/resume/download`;

// admin list
export const listResumesAdmin = () =>
  http.get("/api/resume/list", authHeader());

// preview by id
export const viewResumeByIdUrl = (id) =>
  `${http.defaults.baseURL}/api/resume/${id}/view`;

// set primary resume
export const setPrimaryResume = (id) =>
  http.put(`/api/resume/${id}/primary`, {}, authHeader());

// delete resume
export const deleteResumeById = (id) =>
  http.delete(`/api/resume/${id}`, authHeader());

/* =========================
   AUTH
========================= */
export const adminLogin = (username, password) =>
  http.post("/api/auth/login", { username, password });
