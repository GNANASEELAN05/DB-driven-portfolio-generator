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

const tenant = (username) => `/u/${encodeURIComponent(username || "").trim().toLowerCase()}`;

/* =========================
   VIEWER (PUBLIC GETs)
========================= */
export const getProfile = (username) =>
  http.get(`${tenant(username)}/portfolio/profile`);

export const getSkills = (username) =>
  http.get(`${tenant(username)}/portfolio/skills`);

export const getFeaturedProjects = (username) =>
  http.get(`${tenant(username)}/projects/featured`);

export const getExperience = (username) =>
  http.get(`${tenant(username)}/portfolio/experience`);

export const getEducation = (username) =>
  http.get(`${tenant(username)}/portfolio/education`);

export const getSocials = (username) =>
  http.get(`${tenant(username)}/portfolio/socials`);

export const getAchievements = (username) =>
  http.get(`${tenant(username)}/portfolio/achievements`);

export const getLanguageExperience = (username) =>
  http.get(`${tenant(username)}/portfolio/languages`);

/* =========================
   ADMIN (Portfolio PUTs)
========================= */
export const updateProfile = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/profile`, payload, authHeader());

export const updateSkills = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/skills`, payload, authHeader());

export const updateSocials = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/socials`, payload, authHeader());

export const saveAchievements = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/achievements`, payload, authHeader());

export const saveLanguageExperience = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/languages`, payload, authHeader());

export const updateEducation = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/education`, payload, authHeader());

export const updateExperience = (username, payload) =>
  http.put(`${tenant(username)}/portfolio/experience`, payload, authHeader());

/* =========================
   ADMIN (Projects)
========================= */
export const getAllProjectsAdmin = (username) =>
  http.get(`${tenant(username)}/projects`, authHeader());

export const createProject = (username, payload) =>
  http.post(`${tenant(username)}/projects`, payload, authHeader());

export const updateProject = (username, id, payload) =>
  http.put(`${tenant(username)}/projects/${id}`, payload, authHeader());

export const deleteProject = (username, id) =>
  http.delete(`${tenant(username)}/projects/${id}`, authHeader());

/* =========================
   RESUME SECTION
========================= */

// upload resume
export const uploadResume = (username, file) => {
  const form = new FormData();
  form.append("file", file);

  return http.post(`${tenant(username)}/resume/upload`, form, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// viewer download
export const downloadResumeUrl = (username) =>
  `${http.defaults.baseURL}${tenant(username)}/resume/download`;

export const viewResumeUrl = (username) =>
  `${http.defaults.baseURL}${tenant(username)}/resume/download`;

// admin list
export const listResumesAdmin = (username) =>
  http.get(`${tenant(username)}/resume/list`, authHeader());

// preview by id
export const viewResumeByIdUrl = (username, id) =>
  `${http.defaults.baseURL}${tenant(username)}/resume/${id}/view`;

// set primary resume
export const setPrimaryResume = (username, id) =>
  http.put(`${tenant(username)}/resume/${id}/primary`, {}, authHeader());

// delete resume
export const deleteResumeById = (username, id) =>
  http.delete(`${tenant(username)}/resume/${id}`, authHeader());

/* =========================
   AUTH
========================= */
export const adminLogin = (username, password) =>
  http.post("/auth/login", { username, password });

export const registerUser = (username, password) =>
  http.post("/auth/register", { username, password });
