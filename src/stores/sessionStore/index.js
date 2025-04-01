import { defineStore } from 'pinia'
import actions from './action'

export const useSessionStore = defineStore('session', {
  state: () => ({
    currentSession: [],
    sessionList: [],
    sessionCount: 0,
  }),

  actions,

  persist: {
    key: 'session',
    storage: localStorage, // ✅ Correct usage
    paths: ['currentSession', 'sessionList', 'sessionCount'],
  },
})
