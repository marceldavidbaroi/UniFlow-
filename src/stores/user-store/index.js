import { defineStore } from 'pinia'
import actions from './action'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentRole: null,
    allUsers:[]
  }),

  // actions: {
  //   setUser(user) {
  //     this.currentUser = user
  //     this.currentRole = user.role
  //   },

  //   logout() {
  //     this.currentUser = null
  //     this.currentRole = null
  //   },
  // },
  actions,
  persist: {
    key: 'user',
    storage: localStorage,
    paths: ['currentUser', 'currentRole'],
  },
})
