import api from './client'

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  me: () => api.get('/auth/me'),
}

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  delete: (id) => api.delete(`/projects/${id}`),
  updateMembers: (id, data) => api.patch(`/projects/${id}/members`, data),
}

export const tasksApi = {
  listByProject: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
}

export const usersApi = {
  search: (email) => api.get('/users/search', { params: { email } }),
}

export const dashboardApi = {
  get: (projectId) => api.get('/dashboard', { params: projectId ? { projectId } : {} }),
}
