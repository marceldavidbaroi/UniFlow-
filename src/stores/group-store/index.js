import { defineStore } from 'pinia'
import actions from './action'

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: null,
    groupList: [],
    groupCount: 0,
  }),

  actions,

  persist: {
    enabled: true, // ✅ Required to enable persistence
    key: 'group', // ✅ Key for localStorage/sessionStorage
    storage: localStorage, // ✅ Explicitly use localStorage (or change to sessionStorage if needed)
    paths: ['group', 'groupList'], // ✅ Use `paths` instead of `pick`
  },
})
