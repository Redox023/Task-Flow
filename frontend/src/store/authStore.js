import { create } from 'zustand'
import { authApi } from '../api/services'

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  init: async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const { data } = await authApi.me()
      set({ user: data.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.clear()
      set({ isLoading: false })
    }
  },

  login: async (credentials) => {
    const { data } = await authApi.login(credentials)
    const { user, accessToken, refreshToken } = data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ user, isAuthenticated: true })
    return user
  },

  signup: async (credentials) => {
    const { data } = await authApi.signup(credentials)
    const { user, accessToken, refreshToken } = data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({ user, isAuthenticated: true })
    return user
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try { await authApi.logout(refreshToken) } catch {}
    localStorage.clear()
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
