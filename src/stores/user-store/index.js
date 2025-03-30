import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
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
    key: 'user',
    storage: localStorage,
    paths: ['currentUser', 'currentRole'],
  },
})
