import { create } from 'zustand'
import { projectsApi, tasksApi } from '../api/services'

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  isLoadingProjects: false,
  isLoadingTasks: false,

  fetchProjects: async () => {
    set({ isLoadingProjects: true })
    try {
      const { data } = await projectsApi.list()
      set({ projects: data.data.projects })
    } finally {
      set({ isLoadingProjects: false })
    }
  },

  fetchProject: async (id) => {
    const { data } = await projectsApi.get(id)
    set({ currentProject: data.data.project })
    return data.data.project
  },

  createProject: async (payload) => {
    const { data } = await projectsApi.create(payload)
    const project = data.data.project
    set((s) => ({ projects: [project, ...s.projects] }))
    return project
  },

  deleteProject: async (id) => {
    await projectsApi.delete(id)
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      currentProject: s.currentProject?.id === id ? null : s.currentProject,
    }))
  },

  updateMembers: async (projectId, payload) => {
    await projectsApi.updateMembers(projectId, payload)
    const { data } = await projectsApi.get(projectId)
    const updated = data.data.project
    set((s) => ({
      currentProject: updated,
      projects: s.projects.map((p) => (p.id === projectId ? { ...p, ...updated } : p)),
    }))
  },

  fetchTasks: async (projectId, filters) => {
    set({ isLoadingTasks: true })
    try {
      const { data } = await tasksApi.listByProject(projectId, filters)
      set({ tasks: data.data.tasks })
    } finally {
      set({ isLoadingTasks: false })
    }
  },

  createTask: async (projectId, payload) => {
    const { data } = await tasksApi.create(projectId, payload)
    const task = data.data.task
    set((s) => ({ tasks: [task, ...s.tasks] }))
    return task
  },

  updateTask: async (id, payload) => {
    const { data } = await tasksApi.update(id, payload)
    const task = data.data.task
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }))
    return task
  },

  deleteTask: async (id) => {
    await tasksApi.delete(id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },

  clearTasks: () => set({ tasks: [], currentProject: null }),
}))

export default useProjectStore
