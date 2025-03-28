import { defineStore } from 'pinia'
import actions from './action'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions,
  persist: {
    key: 'auth',
    pick: ['user', 'isAuthenticated'],
  },
  created() {
    this.initAuthState()
  },
})
