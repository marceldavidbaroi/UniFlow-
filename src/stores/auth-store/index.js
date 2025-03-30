import { defineStore } from 'pinia'
import actions from './action'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),

  actions,

  persist: {
    enabled: true,
    key: 'auth',
    storage: localStorage,
    paths: ['user', 'isAuthenticated'],
  },
})
