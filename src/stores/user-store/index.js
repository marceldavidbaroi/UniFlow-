import { defineStore } from 'pinia'
import actions from './action' // Fix import

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentRole: null,
  }),

  actions,
  persist: {
    key: 'auth',
    pick: ['currentUser', 'currentRole'],
  },

  created() {
    this.initAuthState()
  },
})
