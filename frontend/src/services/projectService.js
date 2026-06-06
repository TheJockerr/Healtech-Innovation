import api from './api';

export const getProjects = () => api.get('/projects').then(r => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then(r => r.data);
export const createProject = (data) => api.post('/projects', data).then(r => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then(r => r.data);
export const updateProjectEstado = (id, estado) => api.patch(`/projects/${id}/estado?estado=${estado}`).then(r => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const getProjectTasks = (projectId) => api.get(`/projects/${projectId}/tasks`).then(r => r.data);
export const createTask = (data) => api.post('/tasks', data).then(r => r.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then(r => r.data);
export const updateTaskEstado = (id, estado) => api.patch(`/tasks/${id}/estado?estado=${estado}`).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const getProjectResources = (projectId) => api.get(`/projects/${projectId}/resources`).then(r => r.data);
export const createResource = (data) => api.post('/resources', data).then(r => r.data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);

export const getUsers = () => api.get('/users').then(r => r.data);
