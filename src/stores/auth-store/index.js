import { defineStore } from 'pinia'
import actions from './action'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions,

  persist: {
    enabled: true, // ✅ Ensure persistence is enabled
    key: 'auth', // ✅ Storage key
    storage: localStorage, // ✅ Explicitly set storage type (or sessionStorage)
    paths: ['user', 'isAuthenticated'], // ✅ Use `paths` instead of `pick`
  },
})
