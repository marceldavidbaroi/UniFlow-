import { defineStore } from 'pinia'
import actions from './action'

export const useGroupStore = defineStore('session', {
  state: () => ({
    currentSession: [],
  }),

  actions,

  persist: {
    enabled: true,
    key: 'group',
    storage: localStorage,
    paths: ['group', 'groupList'],
  },
})
