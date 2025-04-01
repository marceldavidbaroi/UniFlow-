import { defineStore } from 'pinia'
import actions from './action'

export const useSessionStore = defineStore('session', {
  state: () => ({
    currentSession: [],
  }),

  actions,

  persist: {
    enabled: true,
    key: 'session',
    storage: localStorage,
    paths: ['currentSession'],
  },
})
