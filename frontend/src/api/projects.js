import API from "./axios";

export const getProjects = () => API.get("/projects");

export const addProject = (data) => API.post("/projects", data);

export const updateProject = (id, data) => API.put(`/projects/${id}`, data);

export const deleteProject = (id) => API.delete(`/projects/${id}`);
