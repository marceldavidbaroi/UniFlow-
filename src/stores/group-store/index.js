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
    enabled: true,
    key: 'group',
    storage: localStorage,
    paths: ['group', 'groupList'],
  },
})
