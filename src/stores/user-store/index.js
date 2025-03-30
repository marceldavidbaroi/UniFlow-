import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null, // ✅ Use `null` instead of `[]`
    currentRole: null,
  }),

  actions: {
    setUser(user) {
      this.currentUser = user
      this.currentRole = user.role
    },

    logout() {
      this.currentUser = null
      this.currentRole = null
    },
  },

  persist: {
    key: 'user', // ✅ Key for localStorage/sessionStorage
    storage: localStorage, // ✅ Use sessionStorage if you prefer non-persistent login
    paths: ['currentUser', 'currentRole'], // ✅ Only persist these
  },
})
